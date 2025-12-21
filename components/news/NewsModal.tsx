import type { CryptoPanicPost } from "@/lib/services/cryptopanic";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface NewsModalProps {
  post: CryptoPanicPost | null;
  isOpen: boolean;
  onClose: () => void;
}

function getKindTagStyles(kind: string): string {
  const styles: Record<string, string> = {
    news: "bg-blue-500/20 text-blue-400",
    media: "bg-purple-500/20 text-purple-400",
    blog: "bg-green-500/20 text-green-400",
    twitter: "bg-cyan-500/20 text-cyan-400",
    reddit: "bg-orange-500/20 text-orange-400",
  };

  return styles[kind.toLowerCase()] || "bg-primary/20 text-primary";
}

export function NewsModal({ post, isOpen, onClose }: NewsModalProps) {
  if (!post) return null;

  const url = post.original_url || post.url;
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const content = post.content?.clean || post.content?.original || post.description || "";

  return (
    <Modal
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-lg",
        base: "bg-card backdrop-blur-2xl max-w-3xl shadow-2xl",
        header: "pt-6 pb-4 px-6",
        body: "px-6 py-4 max-h-[80vh] overflow-y-auto",
        footer: "pt-4 pb-6 px-6",
      }}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      size="3xl"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {post.kind && (
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-md uppercase tracking-wide shrink-0 w-fit ${getKindTagStyles(post.kind)}`}>
                {post.kind}
              </span>
            )}
            <h2 className="text-2xl font-bold text-white leading-tight">{post.title || "Untitled"}</h2>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-400/90">
            {post.source?.title && (
              <>
                <span className="font-medium text-gray-300/80">{post.source.title}</span>
                {formattedDate && <span className="text-gray-500/60">•</span>}
              </>
            )}
            {formattedDate && (
              <time className="text-gray-400/80" dateTime={post.published_at}>
                {formattedDate}
              </time>
            )}
            {post.author && (
              <>
                <span className="text-gray-500/60">•</span>
                <span className="text-gray-400/80">By {post.author}</span>
              </>
            )}
          </div>
        </ModalHeader>
        <ModalBody>
          {content && (
            <div className="prose prose-invert max-w-none">
              {post.content?.clean ? (
                <div className="text-base text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{post.content.clean}</div>
              ) : post.content?.original ? (
                <div
                  dangerouslySetInnerHTML={{ __html: post.content.original }}
                  className="text-base text-gray-300 leading-relaxed prose-headings:text-white prose-p:text-gray-300 prose-a:text-primary prose-strong:text-white break-words"
                />
              ) : post.description ? (
                <div className="text-base text-gray-300 leading-relaxed break-words">{post.description}</div>
              ) : null}
            </div>
          )}

          {post.instruments && post.instruments.length > 0 && (
            <div className="mt-6 pt-6">
              <p className="text-xs font-medium text-gray-400/80 mb-3 uppercase tracking-wider">Related Instruments</p>
              <div className="flex flex-wrap gap-2">
                {post.instruments.map((instrument) => (
                  <span
                    key={instrument.code}
                    className="px-3 py-1.5 bg-gray-800/40 hover:bg-gray-800/60 border border-white/5 rounded-lg text-xs text-gray-300/90 transition-colors">
                    {instrument.title} ({instrument.code})
                  </span>
                ))}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="gap-3">
          <Button className="text-gray-300 hover:text-white" variant="light" onPress={onClose}>
            Close
          </Button>
          {url && (
            <Button
              className="font-medium"
              color="primary"
              endContent={<Icon className="w-4 h-4" icon="lucide:external-link" />}
              onPress={() => window.open(url, "_blank", "noopener,noreferrer")}>
              Read Full Article
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
