'use client'

import Header from "../components/Header";
import ImportManualModal from "../components/ImportManualModal";
import ImportModal from "../components/ImportModal";
import Notification from "../components/Notification";
import TablePosts from "../components/TablePosts";

export default function Home() {
  
  return (
    <>
      <Header />
      <TablePosts />
      <ImportModal/>
      <ImportManualModal/>
      <Notification />
    </>
  );
}
