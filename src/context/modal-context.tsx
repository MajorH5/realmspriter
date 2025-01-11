"use client";

import { OnScreenModal } from "@/types/modal-types";
import React, { createContext, useContext, useState, ReactNode } from "react";

const InitialModal: OnScreenModal | null = "SaveModal";

interface ModalContextType {
    activeModal: OnScreenModal | null;
    openModal: (modal: OnScreenModal) => void;
    closeModal: () => void;
    toggleModal: (modal: OnScreenModal) => void;
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

    const toggleModal = (modal: OnScreenModal) => {
        if (activeModal === modal) {
            closeModal();
        } else {
            openModal(modal);
        }
    };

    return (
        <ModalContext.Provider value={{ activeModal, openModal, closeModal, toggleModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error("useModal must be used within an ModalProvider");
    }

    return context;
}
