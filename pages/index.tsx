import React from "react";
import type { NextPage } from "next";
import { MintApp } from "../components/MintApp";

interface Props {}

const IndexPage: NextPage<Props> = ({}) => {
  return <MintApp />;
};

export default IndexPage;
