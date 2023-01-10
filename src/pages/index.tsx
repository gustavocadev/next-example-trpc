import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import Layout from "../layouts/layout";
import { trpc } from "../utils/api";

const Home: NextPage = () => {
  const [productName, setProductName] = useState("");
  // use tRPC
  const utils = trpc.useContext();
  const allProducts = trpc.product.all.useQuery();

  const addProduct = trpc.product.add.useMutation({
    async onSuccess() {
      await utils.product.all.invalidate();
    },
  });

  const deleteProduct = trpc.product.delete.useMutation({
    async onMutate({ id }) {
      await utils.product.all.cancel();

      const allProducts = utils.product.all.getData();

      const productsUpdated = allProducts?.filter((p) => p.id !== id);

      utils.product.all.setData(undefined, productsUpdated);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (productName.trim().length === 0) return;

    addProduct.mutate({ name: productName });
    setProductName("");
  };

  const handleDeleteProductById = (id: number) => {
    deleteProduct.mutate({ id });
  };

  return (
    <Layout pageTitle="Home">
      <h1 className="py-4 text-4xl font-bold">Products</h1>

      <form className="form-control gap-2" onSubmit={handleSubmit}>
        <label>Crear producto</label>
        <input
          type="text"
          className="input bg-gray-800"
          onChange={(e) => setProductName(e.currentTarget.value)}
          value={productName}
        />
        <button className="btn-primary btn">Crear</button>
      </form>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allProducts.isLoading ? (
          <h1>Is Loading</h1>
        ) : (
          allProducts.data?.map((product) => (
            <div
              key={product.id}
              className="rounded-md bg-gray-800 p-4 shadow-md"
            >
              <h2 className="text-2xl font-bold">{product.name}</h2>
              {/* <p className="text-gray-400">{product.description}</p> */}

              <div className="mt-4 flex items-center justify-between">
                <Link className="btn-primary btn" href={`/${product.id}`}>
                  Editar
                </Link>
                <button
                  className="btn-error btn"
                  onClick={() => handleDeleteProductById(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Home;
