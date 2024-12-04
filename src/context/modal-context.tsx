"use client";

import { OnScreenModal } from "@/types/modal-types";
import React, { createContext, useContext, useState, ReactNode } from "react";

const InitialModal: OnScreenModal | null = "WelcomeModal";

interface ModalContextType {
    activeModal: OnScreenModal | null,
    openModal: (modal: OnScreenModal) => void,
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [activeModal, setActiveModal] = useState<OnScreenModal | null>(InitialModal);
    
    const openModal = (modal: OnScreenModal) => {
        setActiveModal(modal);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    return (
        <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error("useArtEditor must be used within an ArtEditorProvider");
    }

    return context;
}
