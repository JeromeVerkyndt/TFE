import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductsPage from "../Hub/Panier.jsx";
import { vi } from "vitest";
import api from "../../api.js";
import { within } from "@testing-library/react";



beforeEach(() => {
    vi.clearAllMocks();
});

// mock de l'API
vi.mock("../../api.js", () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: [] })), // mock du stock vide
        post: vi.fn(() => Promise.resolve({ data: { id: 1 } })),
        put: vi.fn(() => Promise.resolve({}))
    }
}));

const mockClient = {
    id: 1,
    first_name: "Jean",
    last_name: "Dupont",
    balance: 10,
    extra_balance: 5
};

function renderWithRouter(ui, { route = "/" } = {}) {
    window.history.pushState({}, "Test page", route);
    return render(
        <MemoryRouter initialEntries={[{ pathname: route, state: { client: mockClient } }]}>
            {ui}
        </MemoryRouter>
    );
}

describe("ProductsPage", () => {
    test("affiche le titre Panier", async () => {
        renderWithRouter(<ProductsPage />);
        expect(await screen.findByText(/Panier/i)).toBeInTheDocument();
    });

    test("affiche le portefeuille du client", async () => {
        renderWithRouter(<ProductsPage />);
        expect(await screen.findByText(/Portefeuille de: Jean Dupont/)).toBeInTheDocument();
        expect(screen.getByText("10€")).toBeInTheDocument();
        expect(screen.getByText("5€")).toBeInTheDocument();
    });

    test("bouton Voir le ticket est présent", async () => {
        renderWithRouter(<ProductsPage />);
        const button = await screen.findByRole("button", { name: /Voir le ticket/i });
        expect(button).toBeInTheDocument();
    });

    test("clique sur Voir le ticket ouvre la modale", async () => {
        renderWithRouter(<ProductsPage />);
        const button = await screen.findByRole("button", { name: /Voir le ticket/i });
        fireEvent.click(button);
        // Tu pourras tester un élément de la modale quand elle sera codée
    });

    test("limite la quantité saisie au stock disponible", async () => {
        // on renvoie un produit avec un stock de 3
        api.get.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    product_id: 101,
                    product_name: "Pommes",
                    product_price: 2,
                    product_unit: "kg",
                    promo: 0,
                    quantity: 3,
                    included: 1,
                    product_image_url: ""
                }
            ]
        });

        renderWithRouter(<ProductsPage />);

        // récupère le champ number (spinbutton)
        const input = await screen.findByRole("spinbutton");

        // tape une valeur > stock
        fireEvent.change(input, { target: { value: "10" } });

        // la valeur doit être plafonnée à 3 (le stock)
        expect(input).toHaveValue(3);
    });

    test("affiche correctement un prix promo (calcul et ancien prix barré)", async () => {
        api.get.mockResolvedValueOnce({
            data: [
                {
                    id: 2,
                    product_id: 202,
                    product_name: "Tomates",
                    product_price: 10,
                    product_unit: "pièce",
                    promo: 20,
                    quantity: 50,
                    included: 0,
                    product_image_url: ""
                }
            ]
        });

        renderWithRouter(<ProductsPage />);

        // prix remisé 8.00 € / pièce
        expect(
            await screen.findByText(/8\.00\s*€\s*\/\s*pièce/i)
        ).toBeInTheDocument();

        // on scope la recherche au bloc du produit "Tomates"
        const productTitle = await screen.findByText(/Tomates/i);
        const productItem = productTitle.closest(".list-group-item");
        expect(productItem).toBeTruthy();

        // ancien prix 10 € présent dans CE produit (évite le solde en haut)
        expect(within(productItem).getByText(/10\s*€/i)).toBeInTheDocument();

        // mention du -20% dans CE produit
        expect(within(productItem).getByText(/-20%/i)).toBeInTheDocument();
    });


    test("affiche la liste des produits (abonnement et hors abonnement) avec stock et prix", async () => {
        // 1 produit d'abonnement (sans promo) + 1 produit hors abonnement (avec promo)
        api.get.mockResolvedValueOnce({
            data: [
                {
                    id: 1,
                    product_id: 101,
                    product_name: "Pommes",
                    product_price: 2,
                    product_unit: "kg",
                    promo: 0,
                    quantity: 3,
                    included: 1,
                    product_image_url: ""
                },
                {
                    id: 2,
                    product_id: 202,
                    product_name: "Tomates",
                    product_price: 10,
                    product_unit: "pièce",
                    promo: 20, // -20% => 8.00
                    quantity: 50,
                    included: 0,
                    product_image_url: ""
                }
            ]
        });

        renderWithRouter(<ProductsPage />);

        // --- Section abonnement: Pommes ---
        const pommesTitle = await screen.findByText(/Pommes/i);
        const pommesItem = pommesTitle.closest(".list-group-item");
        expect(pommesItem).toBeTruthy();

        // Stock affiché "(Stock: 3 kg)"
        expect(within(pommesItem).getByText(/\(Stock:\s*3\s*kg\)/i)).toBeInTheDocument();

        // Prix sans promo "2 € / kg"
        expect(within(pommesItem).getByText(/2\s*€\s*\/\s*kg/i)).toBeInTheDocument();

        // --- Section hors abonnement: Tomates ---
        const tomatesTitle = await screen.findByText(/Tomates/i);
        const tomatesItem = tomatesTitle.closest(".list-group-item");
        expect(tomatesItem).toBeTruthy();

        // Stock affiché "(Stock: 50 pièce)"
        expect(within(tomatesItem).getByText(/\(Stock:\s*50\s*pièce\)/i)).toBeInTheDocument();

        // Prix remisé "8.00 € / pièce" + ancien prix barré "10 €" + "-20%"
        expect(within(tomatesItem).getByText(/8\.00\s*€\s*\/\s*pièce/i)).toBeInTheDocument();
        expect(within(tomatesItem).getByText(/-20%/i)).toBeInTheDocument();
        const oldPrice = within(tomatesItem).getByText(/10\s*€/i);
        expect(oldPrice.tagName.toLowerCase()).toBe("s"); // bien barré
    });



});
