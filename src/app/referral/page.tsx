

import dynamic from "next/dynamic";


const Page = dynamic(() => import("./content"));

export default () => {

  return <Page />;
}