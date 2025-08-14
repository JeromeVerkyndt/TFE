import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GestionStockPage from "../Admin/GestionStock.jsx";
import api from "../../api.js";

vi.mock("../../api.js", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

describe("GestionStockPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("affiche le bouton '+ Stock' et les colonnes du tableau", async () => {
        api.get.mockResolvedValueOnce({data: []});
        api.get.mockResolvedValueOnce({data: []});

        render(<GestionStockPage/>);

        expect(await screen.findByText("+ Stock")).toBeInTheDocument();
        expect(screen.getByText("Nom")).toBeInTheDocument();
        expect(screen.getByText("Quantité")).toBeInTheDocument();
        expect(screen.getByText("Prix")).toBeInTheDocument();
        expect(screen.getByText("Promo")).toBeInTheDocument();
    });

    test("charge et affiche les stocks", async () => {
        api.get
            .mockResolvedValueOnce({
                data: [
                    {
                        id: 1,
                        product_name: "Pomme",
                        product_image_url: "img.jpg",
                        quantity: 10,
                        product_price: 2,
                        product_unit: "kg",
                        promo: 0
                    }
                ]
            })
            .mockResolvedValueOnce({data: []});

        render(<GestionStockPage/>);

        expect(await screen.findByText("Pomme")).toBeInTheDocument();
        expect(screen.getByDisplayValue("10")).toBeInTheDocument();
        expect(screen.getByText("2 €/kg")).toBeInTheDocument();
    });

    test("ouvre le modal d'ajout d'un produit au stcok", async () => {
        api.get.mockResolvedValueOnce({data: []});
        api.get.mockResolvedValueOnce({data: []});

        render(<GestionStockPage/>);

        fireEvent.click(await screen.findByText("+ Stock"));
        expect(await screen.findByText(/Ajouter un produit au stock/i)).toBeInTheDocument();
    });

    test("supprime un produit après confirmation", async () => {
        api.get
            .mockResolvedValueOnce({
                data: [
                    {
                        id: 1,
                        product_name: "Pomme",
                        product_image_url: "",
                        quantity: 10,
                        product_price: 2,
                        product_unit: "kg",
                        promo: 0
                    }
                ]
            })
            .mockResolvedValueOnce({data: []});

        api.delete.mockResolvedValueOnce({});
        vi.spyOn(window, "confirm").mockImplementation(() => true);

        render(<GestionStockPage/>);

        const deleteButton = await screen.findByRole("button", {name: "Supprimer"});
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(api.delete).toHaveBeenCalledWith("/stock/1");
        });
    });

    test("met à jour un produit", async () => {
        api.get
            .mockResolvedValueOnce({
                data: [
                    {
                        id: 1,
                        product_name: "Pomme",
                        product_image_url: "",
                        quantity: 10,
                        product_price: 2,
                        product_unit: "kg",
                        promo: 0
                    }
                ]
            })
            .mockResolvedValueOnce({data: []});

        api.put.mockResolvedValueOnce({});

        render(<GestionStockPage/>);

        const updateButton = await screen.findByRole("button", {name: "Update"});
        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith("/stock/update/1", {
                quantity: 10,
                promo: 0
            });
        });
    });
});