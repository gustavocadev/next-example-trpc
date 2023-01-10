import Head from "next/head";

type Props = {
  children: React.ReactNode;
  pageTitle: string;
};

export default function Layout({ children, pageTitle }: Props) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <main className="container mx-auto px-4 md:px-[150px]">{children}</main>
    </>
  );
}
