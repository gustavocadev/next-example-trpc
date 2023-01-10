import { useRouter } from "next/router";
import type { FormEvent } from "react";
import Layout from "../../layouts/layout";
import { trpc } from "../../utils/api";
import { useState } from "react";

export default function ProductId() {
  const router = useRouter();
  const productId = Number(router.query.productId);
  const [productName, setProductName] = useState("");

  const editProduct = trpc.product.edit.useMutation();

  trpc.product.getById.useQuery(
    { id: productId },
    {
      onSuccess(data) {
        if (!data) return;
        setProductName(data.name);
      },
    }
  );

  const handleEditProductForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    editProduct.mutate({
      id: Number(productId),
      data: {
        name: productName,
      },
    });
    void router.push("/");
  };

  return (
    <Layout pageTitle="Editar Producto">
      <h1>Product Id</h1>
      <form className="form-control" onSubmit={handleEditProductForm}>
        <label className="label">Nombre</label>
        <input
          type="text"
          className="input bg-base-300"
          value={productName}
          onChange={(e) => setProductName(e.currentTarget.value)}
        />
        <button className="btn-secondary btn mt-2">Edit</button>
      </form>
    </Layout>
  );
}
