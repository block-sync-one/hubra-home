"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, InputOtp } from "@heroui/react";
import { Gift } from "lucide-react";

interface AccessModalProps {
  isOpen: boolean;
  onAccessGranted: () => void;
}

export function AccessModal({ isOpen, onAccessGranted }: AccessModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setError(false);

    setTimeout(() => {
      if (code.toUpperCase() === "BREAK") {
        onAccessGranted();
      } else {
        setError(true);
        setCode("");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleComplete = (value?: string) => {
    if (value) {
      setCode(value);
      handleSubmit();
    }
  };

  return (
    <Modal
      hideCloseButton
      isKeyboardDismissDisabled
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/80 backdrop-blur-md",
        base: "bg-gray-900/90 backdrop-blur-xl",
        header: "border-b border-white/10",
        body: "py-6",
        footer: "",
      }}
      isDismissable={false}
      isOpen={isOpen}
      placement="center"
      size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Gift className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Breakpoint Giveaway</h3>
              <p className="text-sm text-gray-400 font-normal">Enter access code to see instructions</p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex justify-center">
            <InputOtp
              autoFocus
              allowedKeys="^[A-Za-z]*$"
              classNames={{
                wrapper: "justify-center",
                segment: "data-[focus=true]:border-primary data-[focus-visible=true]:border-primary",
              }}
              errorMessage={error ? "Invalid access code. Please try again." : ""}
              isInvalid={error}
              length={5}
              size="lg"
              value={code}
              variant="bordered"
              onComplete={handleComplete}
              onValueChange={(value?: string) => {
                setCode(value || "");
                setError(false);
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="w-full" color="primary" isLoading={isLoading} size="lg" onPress={handleSubmit}>
            <span>{isLoading ? "Verifying..." : "Submit"}</span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
