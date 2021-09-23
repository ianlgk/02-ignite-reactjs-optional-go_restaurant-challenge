import { useEffect, useRef, useState } from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  isOpen: boolean,
  setIsOpen: () => void,
  children: React.ReactElement,
}

function Modal(props: ModalProps) {
  const [modalStatus, setmodalStatus] = useState(props.isOpen);

  const prevModalStatusRef = useRef<boolean>();

  useEffect(() => {
    prevModalStatusRef.current = props.isOpen;
  });

  const modalStatusPreviousValue = prevModalStatusRef.current ?? props.isOpen;
  
  useEffect(() => {
    if (modalStatusPreviousValue !== props.isOpen) {
      setmodalStatus(props.isOpen);
    }
  }, [props.isOpen, modalStatusPreviousValue]);

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={props.setIsOpen}
      isOpen={modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#F0F0F5',
          color: '#000000',
          borderRadius: '8px',
          width: '736px',
          border: 'none',
        },
        overlay: {
          backgroundColor: '#121214e6',
        },
      }}
    >
      {props.children}
    </ReactModal>
  );
};

export default Modal;
