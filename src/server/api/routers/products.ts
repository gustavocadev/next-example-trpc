import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

const products = [
  { id: 1, name: "Product 1" },
  { id: 2, name: "Product 2" },
  { id: 3, name: "Product 3" },
];

export const productsRouter = createTRPCRouter({
  all: publicProcedure.query(() => {
    return products;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const product = products.find((p) => p.id === input.id);

      console.log(product);

      return product;
    }),

  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      const product = {
        id: products.length + 1,
        name: input.name,
      };
      products.push(product);
      return product;
    }),

  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        // this is data that can be updated
        data: z.object({
          name: z.string().min(1).optional(),
        }),
      })
    )
    .mutation(({ input }) => {
      console.log(input);
      const product = products.find((p) => p.id === input.id);
      if (!product) return;

      product.name = input.data.name ?? product.name;

      return product;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const index = products.findIndex((p) => p.id === input.id);
      if (index === -1) return;

      products.splice(index, 1);
      return {
        msg: " Deleted successfully",
      };
    }),
});
