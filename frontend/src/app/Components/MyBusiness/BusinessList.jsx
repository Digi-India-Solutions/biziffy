// import React from "react";
// import Image from "next/image";
// import placeholderImg from "../../Images/LocalShops.webp";
// import styles from "./BusinessList.module.css"; // Use CSS Module
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// const BusinessList = ({ businessListing }) => {
// const route = useRouter()
//   // console.log("businessListing:+:=>", businessListing)

//   const handleClick = (id) => {
//     route.push(`/pages/mybusiness/editmybusiness/${id}`)
//   }

//   return (
//     <div className="container py-4">
//       <h3 className="mb-4 fw-semibold text-dark">Your Listed Businesses</h3>
//       {businessListing?.map((biz) => (
//         <div
//           className={`row ${styles.businessCard} align-items-center mb-4 p-3`}
//           key={biz.id}
//         >
//           <div className="col-md-4 mb-3 mb-md-0">
//             <div className={styles.imageWrapper}>
//               <Image
//                 src={biz?.businessCategory?.businessImages[0] || placeholderImg}
//                 alt={biz.businessDetails?.businessName}
//                 layout="fill"
//                 objectFit="cover"
//                 className={styles.businessImage}
//               />
//             </div>
//           </div>
//           <div className="col-md-8">
//             <h4 className={styles.businessTitle}>{biz?.businessDetails?.businessName}</h4>
//             <p className="mb-1 text-muted">{biz?.businessCategory?.category.name}</p>
//             <p className="mb-3 text-secondary">
//               {[
//                 biz.businessDetails?.building,
//                 biz.businessDetails?.street,
//                 biz.businessDetails?.landmark,
//                 biz.businessDetails?.city,
//                 biz.businessDetails?.state,
//                 biz.businessDetails?.pinCode
//               ]
//                 .filter(Boolean)
//                 .join(", ")}
//             </p>
//             <div>
//               <div href="/pages/free-listing#paidlisting">
//                 <button className="login-btn me-2">Advertise Now</button>
//               </div>
//               <div onClick={()=>handleClick(biz?._id) }>
//                 <button className="black-btn">Edit Business</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BusinessList;


import React from "react";
import Image from "next/image";
import Link from "next/link";
import placeholderImg from "../../Images/LocalShops.webp";
import styles from "./BusinessList.module.css";
import { useRouter } from "next/navigation";

const BusinessList = ({ businessListing }) => {
  const router = useRouter();

  const handleEditClick = (id) => {
    router.push(`/pages/mybusiness/editmybusiness/${id}`);
  };  


  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-semibold text-dark">Your Listed Businesses</h3>

      {businessListing?.length === 0 && (
        <p className="text-muted">No businesses found.</p>
      )}

      {businessListing?.map((biz) => {
        // console.log("", biz.businessCategory?.businessImages?.[0])
        const imageSrc = biz.businessCategory?.businessImages?.[0] || placeholderImg;

        const fullAddress = [
          biz.businessDetails?.building,
          biz.businessDetails?.street,
          biz.businessDetails?.landmark,
          biz.businessDetails?.city,
          biz.businessDetails?.state,
          biz.businessDetails?.pinCode,
        ]
          .filter(Boolean)
          .join(", ");

        return (
          <div
            className={`row ${styles.businessCard} align-items-center mb-4 p-3`}
            key={biz._id}
          >
            <div className="col-md-4 mb-3 mb-md-0">
              <div className={styles.imageWrapper}>
                <Image
                  src={imageSrc}
                  alt={biz.businessDetails?.businessName || "Business Image"}
                  layout="fill"
                  objectFit="cover"
                  className={styles.businessImage}
                />
              </div>
            </div>

            <div className="col-md-8">
              <h4 className={styles.businessTitle}>
                {biz.businessDetails?.businessName || "Untitled Business"}
              </h4>
              <p className="mb-1 text-muted">
                {biz.businessCategory?.category?.name || "Uncategorized"}
              </p>
              <p className="mb-3 text-secondary">{fullAddress || "No address"}</p>

              <div className="d-flex">
                <Link href="/pages/free-listing#paidlisting" passHref>
                  <button className="login-btn me-2">Advertise Now</button>
                </Link>

                <button
                  className="black-btn"
                  onClick={() => handleEditClick(biz?._id)}
                >
                  Edit Business
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BusinessList;
