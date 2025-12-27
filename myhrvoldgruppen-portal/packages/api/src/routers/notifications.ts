import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { sql } from "drizzle-orm";

// For nå bruker vi en enkel in-memory struktur
// I produksjon vil dette være en database-tabell
interface Notification {
  id: string;
  type: "claim" | "service" | "system" | "reminder";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  userId: string;
}

// Mock notifications - vil bli erstattet med database
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "claim",
    title: "Ny reklamasjon",
    message: "Reklamasjon ELE-2512-0023 er opprettet for Hotel Bristol",
    link: "/claims/1",
    read: false,
    createdAt: new Date("2024-12-27T10:30:00"),
    userId: "user-1",
  },
  {
    id: "2",
    type: "service",
    title: "Servicebesøk i dag",
    message: "Du har 2 planlagte servicebesøk i dag",
    link: "/service/visits",
    read: false,
    createdAt: new Date("2024-12-27T08:00:00"),
    userId: "user-1",
  },
  {
    id: "3",
    type: "claim",
    title: "Status oppdatert",
    message: "Reklamasjon UBE-2512-0022 er nå satt til 'Løst'",
    link: "/claims/2",
    read: true,
    createdAt: new Date("2024-12-26T15:45:00"),
    userId: "user-1",
  },
  {
    id: "4",
    type: "reminder",
    title: "Avtale utløper snart",
    message: "Serviceavtale SK-2024-003 utløper om 30 dager",
    link: "/service/agreements/3",
    read: true,
    createdAt: new Date("2024-12-25T09:00:00"),
    userId: "user-1",
  },
  {
    id: "5",
    type: "system",
    title: "Ny funksjon tilgjengelig",
    message: "Du kan nå eksportere rapporter til Excel",
    read: true,
    createdAt: new Date("2024-12-24T12:00:00"),
    userId: "user-1",
  },
];

export const notificationsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          unreadOnly: z.boolean().default(false),
          limit: z.number().min(1).max(50).default(20),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const { unreadOnly = false, limit = 20 } = input ?? {};

      let notifications = [...mockNotifications];

      if (unreadOnly) {
        notifications = notifications.filter((n) => !n.read);
      }

      return notifications.slice(0, limit);
    }),

  unreadCount: publicProcedure.query(async ({ ctx }) => {
    return mockNotifications.filter((n) => !n.read).length;
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const notification = mockNotifications.find((n) => n.id === input.id);
      if (notification) {
        notification.read = true;
      }
      return { success: true };
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    mockNotifications.forEach((n) => {
      n.read = true;
    });
    return { success: true };
  }),
});

export const emailRouter = router({
  send: protectedProcedure
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string().min(1),
        body: z.string().min(1),
        claimId: z.string().uuid().optional(),
        template: z.enum(["claim_created", "claim_updated", "supplier_inquiry", "custom"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // I produksjon: integrer med e-posttjeneste (f.eks. Resend, SendGrid)
      console.log("Sending email:", input);
      return {
        success: true,
        messageId: `msg-${Date.now()}`,
      };
    }),

  templates: publicProcedure.query(async ({ ctx }) => {
    return [
      {
        id: "claim_created",
        name: "Reklamasjon opprettet",
        subject: "Ny reklamasjon: {{claimNumber}}",
        body: "En ny reklamasjon er registrert...",
      },
      {
        id: "claim_updated",
        name: "Reklamasjon oppdatert",
        subject: "Oppdatering på reklamasjon: {{claimNumber}}",
        body: "Det har blitt gjort endringer...",
      },
      {
        id: "supplier_inquiry",
        name: "Leverandørhenvendelse",
        subject: "Garantisak: {{claimNumber}}",
        body: "Vi har registrert en reklamasjon...",
      },
    ];
  }),
});
