"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// OpenAI Realtime API への WebRTC 接続と文字起こしイベントの処理
// 言語方向は指定せず、サーバー側の instructions で日英を自動判定して通訳する
// 設計: docs/20260607_openai_translate.md

type TranslatorStatus = "idle" | "connecting" | "active";

interface TranscriptMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const REALTIME_CALLS_URL = "https://api.openai.com/v1/realtime/calls";
const SESSION_API_URL = "/api/realtime-translate/session";
// 履歴の保持上限。長時間セッションでの DOM 肥大・再レンダリングコスト増を防ぐ
const MAX_MESSAGES = 200;

interface RealtimeEvent {
  type: string;
  item_id?: string;
  response_id?: string;
  transcript?: string;
  delta?: string;
}

/**
 * @param onAuthError パスワードが失効していた場合（401）に呼ばれる。
 *                    呼び出し側でゲート画面へ戻して再入力を求める
 */
export function useRealtimeTranslator(onAuthError?: () => void) {
  const [status, setStatus] = useState<TranslatorStatus>("idle");
  const [micEnabled, setMicEnabled] = useState(true);
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  // 接続の世代番号。stop()/アンマウントでインクリメントし、進行中の start() を無効化する
  const sessionGenRef = useRef(0);

  const cleanupConnection = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current = null;
    }
  }, []);

  // アンマウント時に進行中の開始処理も無効化して接続を破棄
  useEffect(
    () => () => {
      sessionGenRef.current++;
      cleanupConnection();
    },
    [cleanupConnection]
  );

  const stop = useCallback(() => {
    sessionGenRef.current++; // 進行中の start() をキャンセル
    cleanupConnection();
    setStatus("idle");
    setMicEnabled(true);
  }, [cleanupConnection]);

  /** 履歴へメッセージを追加・更新する（append=true なら既存テキストに追記） */
  const upsertMessage = useCallback(
    (id: string, role: TranscriptMessage["role"], text: string, append: boolean) => {
      setMessages((prev) => {
        const existing = prev.find((m) => m.id === id);
        if (existing) {
          return prev.map((m) =>
            m.id === id ? { ...m, text: append ? m.text + text : text } : m
          );
        }
        const next = [...prev, { id, role, text }];
        // 上限超過時は古いものから破棄
        return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next;
      });
    },
    []
  );

  /** 翻訳テキスト（自分の発話 / 翻訳結果）をイベントから履歴へ反映する */
  const handleRealtimeEvent = useCallback(
    (event: RealtimeEvent) => {
      switch (event.type) {
        // 自分の発話の文字起こし
        case "conversation.item.input_audio_transcription.completed": {
          const text = event.transcript?.trim();
          if (text) {
            upsertMessage(`user-${event.item_id}`, "user", text, false);
          }
          break;
        }
        // 翻訳音声の文字起こし（ストリーミング）
        case "response.output_audio_transcript.delta":
        case "response.audio_transcript.delta": {
          if (event.delta) {
            upsertMessage(
              `assistant-${event.response_id}`,
              "assistant",
              event.delta,
              true
            );
          }
          break;
        }
        // 翻訳音声の文字起こし（確定）
        case "response.output_audio_transcript.done":
        case "response.audio_transcript.done": {
          const text = event.transcript?.trim();
          if (text) {
            upsertMessage(
              `assistant-${event.response_id}`,
              "assistant",
              text,
              false
            );
          }
          break;
        }
      }
    },
    [upsertMessage]
  );

  const start = useCallback(
    async (password: string) => {
      const gen = ++sessionGenRef.current;
      setError(null);
      setStatus("connecting");

      try {
        // ① 一時トークン発行を開始（await はマイク取得後 — 許可ダイアログと並行で進める。
        //    パスワードはサーバー側で毎回照合される。reject は値化して未処理拒否を防ぐ）
        const sessionResPromise = fetch(SESSION_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }).catch(() => null);

        // ② マイク取得（HTTP など非セキュアな接続では mediaDevices 自体が存在しない）
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error(
            "この接続ではマイクを利用できません。HTTPS または localhost でアクセスしてください。"
          );
        }
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (gen !== sessionGenRef.current) {
          // 接続中に停止された: ref 未登録のためここで直接解放する
          micStream.getTracks().forEach((track) => track.stop());
          return;
        }
        micStreamRef.current = micStream;

        // ③ トークン受領（②と並行して発行済み）
        const sessionRes = await sessionResPromise;
        if (gen !== sessionGenRef.current) return; // 接続中に停止された
        if (sessionRes?.status === 401) {
          // 保存済みパスワードが失効: 接続を破棄してゲート画面へ戻す
          cleanupConnection();
          setStatus("idle");
          onAuthError?.();
          return;
        }
        if (!sessionRes?.ok) {
          const data = await sessionRes?.json().catch(() => null);
          throw new Error(data?.error ?? "翻訳セッションの開始に失敗しました");
        }
        const { clientSecret } = await sessionRes.json();

        // ④ WebRTC 接続
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        const audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        audioElRef.current = audioEl;
        pc.ontrack = (e) => {
          audioEl.srcObject = e.streams[0];
        };

        micStream.getTracks().forEach((track) => pc.addTrack(track, micStream));

        const dc = pc.createDataChannel("oai-events");
        dc.onmessage = (e) => {
          try {
            handleRealtimeEvent(JSON.parse(e.data));
          } catch {
            // 不正な JSON は無視
          }
        };

        pc.onconnectionstatechange = () => {
          if (gen !== sessionGenRef.current) return; // 旧セッションのイベントは無視
          if (
            pc.connectionState === "failed" ||
            pc.connectionState === "disconnected"
          ) {
            setError("接続が切断されました。再度開始してください。");
            stop();
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const sdpRes = await fetch(REALTIME_CALLS_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clientSecret}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        });
        // ref 登録済みのため停止時は cleanupConnection が解放している
        if (gen !== sessionGenRef.current) return;
        if (!sdpRes.ok) {
          throw new Error("音声接続に失敗しました");
        }
        await pc.setRemoteDescription({
          type: "answer",
          sdp: await sdpRes.text(),
        });
        if (gen !== sessionGenRef.current) return;

        setMicEnabled(true);
        setStatus("active");
      } catch (err) {
        if (gen !== sessionGenRef.current) return; // 停止済みならエラー表示しない
        cleanupConnection();
        setStatus("idle");
        setError(
          err instanceof DOMException && err.name === "NotAllowedError"
            ? "マイクの使用が許可されていません。ブラウザの設定を確認してください。"
            : err instanceof Error
              ? err.message
              : "エラーが発生しました"
        );
      }
    },
    [cleanupConnection, handleRealtimeEvent, stop, onAuthError]
  );

  const toggleMic = useCallback(() => {
    const stream = micStreamRef.current;
    if (!stream) return;
    setMicEnabled((prev) => {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !prev;
      });
      return !prev;
    });
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    status,
    micEnabled,
    messages,
    error,
    start,
    stop,
    toggleMic,
    clearMessages,
  };
}
