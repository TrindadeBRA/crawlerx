'use client'

import Header from "../components/Header";
import ImportModal from "../components/ImportModal";
import Notification from "../components/Notification";
import TablePosts from "../components/TablePosts";

export default function Home() {
  
  return (
    <>
      <Header />
      <TablePosts />
      <ImportModal/>
      <Notification />
    </>
  );
}
