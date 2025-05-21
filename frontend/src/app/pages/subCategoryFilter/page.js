import React, { Suspense } from "react";
import SubCategoryComponent from "../../Components/SubCategoryFilterComp/SubcategoryComponent";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <SubCategoryComponent />
    </Suspense>
  );
};

export default Page;
