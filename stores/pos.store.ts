import { create } from "zustand";
import type { CartItemInput } from "@/schemas/transaction.schema";
import type { PosPaymentMethod } from "@/constants/payments";
import type {
  PosBarberDto,
  PosCustomerDto,
  PosServiceDto,
  TransactionDto,
} from "@/services/transaction.service";
import { calculatePosTotals } from "@/utils/pos-calculations";

type PosState = {
  items: CartItemInput[];
  customer: PosCustomerDto | null;
  walkIn: boolean;
  barberId: string | null;
  discountAmount: number;
  discountPercent: number;
  taxPercent: number;
  notes: string;
  paymentMethod: PosPaymentMethod;
  cashPaid: number;
  serviceSearch: string;
  lastTransaction: TransactionDto | null;
  receiptOpen: boolean;

  addService: (service: PosServiceDto) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  setCustomer: (customer: PosCustomerDto | null) => void;
  setWalkIn: (walkIn: boolean) => void;
  setBarberId: (barberId: string | null) => void;
  setDiscountAmount: (amount: number) => void;
  setDiscountPercent: (percent: number) => void;
  setTaxPercent: (percent: number) => void;
  setNotes: (notes: string) => void;
  setPaymentMethod: (method: PosPaymentMethod) => void;
  setCashPaid: (amount: number) => void;
  setServiceSearch: (search: string) => void;
  setLastTransaction: (transaction: TransactionDto | null) => void;
  setReceiptOpen: (open: boolean) => void;
  clearCart: () => void;
  getTotals: () => ReturnType<typeof calculatePosTotals>;
};

const initialCheckout = {
  customer: null as PosCustomerDto | null,
  walkIn: false,
  barberId: null as string | null,
  discountAmount: 0,
  discountPercent: 0,
  notes: "",
  paymentMethod: "CASH" as PosPaymentMethod,
  cashPaid: 0,
};

export const usePosStore = create<PosState>((set, get) => ({
  items: [],
  ...initialCheckout,
  taxPercent: 11,
  serviceSearch: "",
  lastTransaction: null,
  receiptOpen: false,

  addService: (service) => {
    set((state) => {
      const existing = state.items.find((i) => i.serviceId === service.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.serviceId === service.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            serviceId: service.id,
            serviceName: service.name,
            price: service.price,
            quantity: 1,
          },
        ],
      };
    });
  },

  removeItem: (serviceId) => {
    set((state) => ({
      items: state.items.filter((i) => i.serviceId !== serviceId),
    }));
  },

  updateQuantity: (serviceId, quantity) => {
    if (quantity < 1) return;
    set((state) => ({
      items: state.items.map((i) =>
        i.serviceId === serviceId ? { ...i, quantity } : i,
      ),
    }));
  },

  setCustomer: (customer) => set({ customer, walkIn: false }),
  setWalkIn: (walkIn) =>
    set(walkIn ? { walkIn: true, customer: null } : { walkIn: false }),
  setBarberId: (barberId) => set({ barberId }),
  setDiscountAmount: (discountAmount) =>
    set({ discountAmount, discountPercent: 0 }),
  setDiscountPercent: (discountPercent) =>
    set({ discountPercent, discountAmount: 0 }),
  setTaxPercent: (taxPercent) => set({ taxPercent }),
  setNotes: (notes) => set({ notes }),
  setPaymentMethod: (paymentMethod) =>
    set(
      paymentMethod === "QRIS"
        ? { paymentMethod, cashPaid: 0 }
        : { paymentMethod },
    ),
  setCashPaid: (cashPaid) => set({ cashPaid }),
  setServiceSearch: (serviceSearch) => set({ serviceSearch }),
  setLastTransaction: (lastTransaction) => set({ lastTransaction }),
  setReceiptOpen: (receiptOpen) => set({ receiptOpen }),

  clearCart: () =>
    set({
      items: [],
      ...initialCheckout,
    }),

  getTotals: () => {
    const state = get();
    return calculatePosTotals({
      items: state.items,
      discountAmount: state.discountAmount,
      discountPercent: state.discountPercent,
      taxPercent: state.taxPercent,
    });
  },
}));

export type { PosBarberDto, PosCustomerDto, PosServiceDto };
