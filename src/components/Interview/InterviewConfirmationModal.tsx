import React, { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

interface InterviewConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const InterviewConfirmationModal: React.FC<InterviewConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  // Use effect to manage modal's open/close state using DaisyUI's dialog
  useEffect(() => {
    const modalElement = modalRef.current;
    
    if (modalElement) {
      if (isOpen) {
        if (!modalElement.open) {
          modalElement.showModal();
        }
      } else {
        modalElement.close();
      }
    }
  }, [isOpen]);

  // Handle when the dialog is closed (e.g., by hitting Escape)
  useEffect(() => {
    const modalElement = modalRef.current;
    
    const handleClose = () => {
      if (!modalElement?.open && isOpen) {
        onClose();
      }
    };
    
    modalElement?.addEventListener('close', handleClose);
    return () => {
      modalElement?.removeEventListener('close', handleClose);
    };
  }, [isOpen, onClose]);

  return (
    <dialog 
      id="interview_confirmation_modal" 
      className="modal modal-bottom sm:modal-middle" 
      ref={modalRef}
    >
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg flex items-center">
          <AlertTriangle className="text-warning mr-2 w-5 h-5" />
          Important Notice
        </h3>
        <p className="py-4">
          You are about to start an interview session. Please note that this action is <strong>irreversible</strong>. 
          Once the interview session is activated, it cannot be stopped or restarted.
        </p>
        <p className="py-2 text-sm opacity-75">
          Make sure you have allocated sufficient time to complete this round.
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn mr-2" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={onConfirm}>Proceed</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default InterviewConfirmationModal; 