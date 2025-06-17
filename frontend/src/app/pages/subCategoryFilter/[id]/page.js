'use client';
import React, { Suspense } from "react";
import SubCategoryComponent from "../../../Components/SubCategoryFilterComp/SubcategoryComponent";
import { useParams } from "next/navigation";

const Page = () => {
    const params = useParams();
    const id = params?.id;
    const Id = id
    console.log("XXXXXXXXXX:=>", Id)
    return (
        <Suspense fallback={<div>Loading filters...</div>}>
            <SubCategoryComponent Id={Id} />
        </Suspense>
    );
};

export default Page;
