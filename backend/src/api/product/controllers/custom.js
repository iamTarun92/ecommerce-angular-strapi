"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async build(ctx) {
    try {
      const { id } = ctx.params;
      const product = await strapi.db.query("api::product.product").findOne({
        where: { id },
        populate: true,
      });

      if (!product || !product.attributes || !product.attributes.length) {
        ctx.response.status = 404;
        ctx.send({ error: "Product not found" });
        return;
      }

      const cartesian = (sets) => {
        return sets.reduce(
          (acc, curr) => {
            return acc
              .map((x) => {
                return curr.map((y) => {
                  return x.concat([y]);
                });
              })
              .flat();
          },
          [[]]
        );
      };
      const attributeValues = product.attributes.map((attribute) =>
        attribute.options.map((option) => option.value)
      );
      const variations = cartesian(attributeValues);
      const records = variations.map((variation) => {
        const name = variation.reduce(
          (acc, current) => acc + " " + Object.values(current)[0],
          product.name
        );
        const slug = variation
          .reduce(
            (acc, current) =>
              acc + "-" + Object.values(current)[0].replace(/ /g, "-"),
            product.slug
          )
          .toLowerCase();

        const categories = product.categories.map((cat) => cat.id);
        const reviews = product.reviews.map((cat) => cat.id);

        return {
          name: name,
          slug: slug,
          description: product.description,
          isFixedPrice: product.isFixedPrice,
          price: product.price,
          specialPrice: product.specialPrice,
          stock: product.stock,
          image: product.image,
          categories,
          // reviews,
          product: product.id,
        };
      });

      const createAllRecords = await Promise.all(
        records.map(async (record) => {
          try {
            return await strapi.entityService.create(
              "api::variation.variation",
              { data: record }
            );
          } catch (err) {
            console.error(err);
            throw new Error("Failed to create variation record");
          }
        })
      );

      ctx.send(createAllRecords);
    } catch (err) {
      console.error(err);
      ctx.response.status = 500;
      ctx.send({ error: "Internal server error" });
    }
  },
}));
