import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import React, { forwardRef, memo, useMemo } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

export interface CopyTextProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  textClassName?: string;
  copyText?: string;
  copyValue?: string;
  children?: string;
}

export const CopyText = memo(
  forwardRef<HTMLDivElement, CopyTextProps>((props, forwardedRef) => {
    const { className, textClassName, children, copyText = "Copy", copyValue } = props;
    const [copied, setCopied] = React.useState(false);
    const [copyTimeout, setCopyTimeout] = React.useState<ReturnType<typeof setTimeout> | null>(null);
    const onClearTimeout = () => {
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
    };

    const handleClick = () => {
      onClearTimeout();
      navigator.clipboard.writeText(copyValue || children || "");
      setCopied(true);

      setCopyTimeout(
        setTimeout(() => {
          setCopied(false);
        }, 3000)
      );
    };

    const content = useMemo(() => (copied ? "Copied" : copyText), [copied, copyText]);

    return (
      <div ref={forwardedRef} className={cn("flex items-center gap-2", className)}>
        <span className={textClassName}>{children}</span>
        <Tooltip className="bg-gray-900  text-xs" content={content}>
          <Button
            isIconOnly
            className="h-4 w-0 min-w-[16px] text-gray-600  hover:text-white dark:text-gray-600 "
            size="md"
            variant="light"
            onPress={handleClick}>
            {!copied && <Icon className="h-4 w-4" icon="solar:copy-linear" />}
            {copied && <Icon className="h-4 w-4" icon="solar:check-read-linear" />}
          </Button>
        </Tooltip>
      </div>
    );
  })
);

CopyText.displayName = "CopyText";
