'use client'

import Header from "../../src/components/Header";
import ImportManualModal from "../../src/components/ImportManualModal";
import ImportModal from "../../src/components/ImportModal";
import Notification from "../../src/components/Notification";
import TablePosts from "../../src/components/TablePosts";

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
