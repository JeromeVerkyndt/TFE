import React from "react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateSubscription from "../Admin/CreateSubscription.jsx";
import api from "../../api.js";

// Mock de l'API
vi.mock("../../api.js", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("CreateSubscription", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("charge et affiche la liste des abonnements", async () => {
        api.get.mockResolvedValueOnce({
            data: [
                { id: 1, name: "Pack A", description: "Desc A", price: 10, visible: true },
            ],
        });

        render(<CreateSubscription />);

        expect(await screen.findByText("Pack A")).toBeInTheDocument();
        expect(screen.getByText("Desc A")).toBeInTheDocument();
        expect(screen.getByText("10 €")).toBeInTheDocument();
    });

    test("ouvre et ferme le modal de création", async () => {
        api.get.mockResolvedValueOnce({ data: [] });

        render(<CreateSubscription />);

        const openBtn = screen.getByRole("button", { name: /\+ Abonnement/i });
        fireEvent.click(openBtn);
        await screen.findByText("Créer un abonnement");

        expect(await screen.findByText("Créer un abonnement")).toBeInTheDocument();

        const closeBtn = screen.getByRole("button", { name: /Quitter/i });
        fireEvent.click(closeBtn);

        await waitFor(() => {
            expect(screen.queryByText("Créer un abonnement")).not.toBeInTheDocument();
        });
    });

    test("crée un abonnement", async () => {
        api.get.mockResolvedValueOnce({ data: [] });
        api.post.mockResolvedValueOnce({});

        render(<CreateSubscription />);

        fireEvent.click(screen.getByRole("button", { name: /\+ Abonnement/i }));
        await screen.findByText('Créer un abonnement');

        fireEvent.change(screen.getByLabelText(/Nom de l'abonnement/i), { target: { value: "Pack Test" } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Desc Test" } });
        fireEvent.change(screen.getByLabelText(/Prix/i), { target: { value: "20" } });

        fireEvent.click(screen.getByRole("button", { name: /Créer/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith("/subscriptions/add", {
                name: "Pack Test",
                description: "Desc Test",
                price: "20",
            });
        });
    });

    test("met à jour la visibilité", async () => {
        api.get.mockResolvedValueOnce({
            data: [{ id: 1, name: "Pack A", description: "Desc", price: 5, visible: true }],
        });
        api.put.mockResolvedValueOnce({});

        render(<CreateSubscription />);

        const checkbox = await screen.findByRole("checkbox");
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith("/subscriptions/visibility/1", { visible: false });
        });
    });

    test("supprime un abonnement après confirmation", async () => {
        api.get.mockResolvedValueOnce({
            data: [{ id: 1, name: "Pack A", description: "Desc", price: 5, visible: true }],
        });
        api.delete.mockResolvedValueOnce({});
        vi.spyOn(window, "confirm").mockImplementation(() => true);

        render(<CreateSubscription />);

        const deleteBtn = await screen.findByRole("button", { name: "Supprimer" });
        fireEvent.click(deleteBtn);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith("/subscriptions/1");
        });
    });
});
