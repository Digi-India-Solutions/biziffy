"use client";
import { useEffect, useState } from "react";
import "./Testimonial.css";
import Heading from "../Heading/SecHeading";
import { getData } from "../../services/FetchNodeServices";

const TestimonialSection = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [showAll, setShowAll] = useState(false); 
  const [faqs, setFaqs] = useState([]);
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const fetchFaqs = async () => {
    const response = await getData("faq/get-all-faqs");
    if (response?.status === true) {
      const data = response?.data.filter((faq) => faq?.status === true);
      setFaqs(data);
    }
  };

  // Show only the first 5 FAQs initially, then all when showAll is true
  const visibleFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <>
      <Heading title="Frequently Asked Questions" subtitle="FAQ & Reviews" />
      <div className="testimonil-section container-fluid py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-10 mx-auto">
              {visibleFaqs.map((faq, index) => (
                <div
                  key={faq?._id}
                  className="testimonil-faq-box p-3 rounded shadow-sm mb-3"
                >
                  <button
                    className="testimonil-faq-btn btn w-100 text-start fw-bold"
                    onClick={() => toggleFaq(faq?._id)}
                  >
                    {index + 1}. {faq?.question}{" "}
                    {openFaq === faq?._id ? (
                      <i className="bi bi-caret-up-fill"></i>
                    ) : (
                      <i className="bi bi-caret-down-fill"></i>
                    )}
                  </button>

                  {openFaq === faq?._id && (
                    <p className="testimonil-faq-answer mt-2">{faq?.answer}</p>
                  )}
                </div>
              ))}

              {/* View More / View Less Button */}
              <div className="d-flex justify-content-center mt-2">
                <button
                  className="login-btn"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "View Less" : "View More"}{" "}
                  <i
                    className={`bi bi-chevron-${showAll ? "compact-up" : "compact-down"
                      }`}
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialSection;
