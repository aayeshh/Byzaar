// ProductDetails.js
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { Rating } from '@mui/material';
import { useParams } from "react-router-dom";
import axios from "../axios"
import { useStateValue } from "../StateProvider";
function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [{user}, dispatch] = useStateValue();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data.product);
        const reviewsResponse = await axios.get(`/api/reviews/${productId}`);
        setReviews(reviewsResponse.data.reviews);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [productId]);
  
  const addToBasket = async (e) => {
    e.stopPropagation();
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id:product.Product_ID,
        title:product.Product_Name,
        price:product.Cost,
        image:product.imageurl,
        category:product.Category_ID
      },
    });
  }
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/reviews", {
        Product_ID: product.Product_ID,
        Rating: rating,
        Review_Text: reviewText,
        Buyer_ID: user?.UserID,
        Category_ID: product.Category_ID,
      });
      // Refresh reviews after submission
      const reviewsResponse = await axios.get(`/api/reviews/${productId}`);
      setReviews(reviewsResponse.data.reviews);
      // Reset form
      setRating(0);
      setReviewText("");
      setShowReviewForm(false);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code outside the 2xx range
        console.error("Server responded with an error:");
        console.error("Status Code:", error.response.status);
        console.error("Response Data:", error.response.data);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from the server:");
        console.error(error.request);
      } else {
        // An error occurred in setting up the request
        console.error("Error in setting up the request:", error.message);
      }
      console.error("Axios Error Config:", error.config);
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!product) {
    return <div>Error loading product details.</div>;
  }
  
  return (
    
    <Container>
      <Breadcrumb>
        <span>Home</span> › <span>{product.Category_Name}</span> › <span>{product.Product_Name}</span>
      </Breadcrumb>

      <ProductContainer>
        <ImageGallery>
          <MainImage>
            <img src={product.imageurl} alt={product.Product_Name} />
          </MainImage>
          <ThumbnailContainer>
            {/* Additional thumbnails would go here */}
            <Thumbnail>
              <img src={product.imageurl} alt={product.Product_Name} />
            </Thumbnail>
          </ThumbnailContainer>
        </ImageGallery>
        
        <ProductInfo>
          <h1>{product.Product_Name}</h1>
          <BrandText>Brand: {product.Brand}</BrandText>
          
          <PriceContainer>
            {product.Discount > 0 && (
              <OriginalPrice>${(product.Cost * 1.2).toFixed(2)}</OriginalPrice>
            )}
            <Price>${product.Cost.toFixed(2)}</Price>
            {product.Discount > 0 && (
              <DiscountBadge>Save {product.Discount}%</DiscountBadge>
            )}
          </PriceContainer>
          
          <Availability>
            {product.Quantity > 0 ? 
              <InStock>In Stock (Only {product.Quantity} left!)</InStock> : 
              <OutOfStock>Currently Unavailable</OutOfStock>
            }
          </Availability>
          
          <ProductMeta>
            <MetaItem>
              <MetaLabel>Color:</MetaLabel>
              <MetaValue>{product.Color}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Size:</MetaLabel>
              <MetaValue>{product.Size}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Material:</MetaLabel>
              <MetaValue>{product.Material}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Category:</MetaLabel>
              <MetaValue>{product.Category_Name}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Warranty:</MetaLabel>
              <MetaValue>Until {product.Best_Before_Or_Warranty}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Sold by:</MetaLabel>
              <MetaValue>{product.Seller_FirstName} {product.Seller_LastName}</MetaValue>
            </MetaItem>
          </ProductMeta>
          
          <DescriptionText>
            <h3>About this item</h3>
            <p>{product.P_Description}</p>
          </DescriptionText>
          
          <ButtonGroup>
            <AddToCartButton onClick={addToBasket}>Add to Cart</AddToCartButton>
          </ButtonGroup>
        </ProductInfo>
      </ProductContainer>
      
      <AdditionalInfo>
        <InfoSection>
          <h3>Product Details</h3>
          <InfoTable>
            <tbody>
              <tr>
                <td>Brand</td>
                <td>{product.Brand}</td>
              </tr>
              <tr>
                <td>Model</td>
                <td>{product.Product_Name}</td>
              </tr>
              <tr>
                <td>Color</td>
                <td>{product.Color}</td>
              </tr>
              <tr>
                <td>Material</td>
                <td>{product.Material}</td>
              </tr>
              <tr>
                <td>Date Listed</td>
                <td>{product.Date_placed}</td>
              </tr>
            </tbody>
          </InfoTable>
        </InfoSection>
      </AdditionalInfo>
      <AddReviewButton onClick={() => setShowReviewForm(!showReviewForm)}>
        {showReviewForm ? "−" : "+"} Add Review
      </AddReviewButton>
      {showReviewForm && (
  <ReviewForm onSubmit={handleReviewSubmit}>
    <Rating
      name="rating"
      value={rating}
      onChange={(event, newValue) => setRating(newValue)}
    />
    <textarea
      placeholder="Write your review..."
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
      required
    />
    <SubmitButton type="submit">Submit Review</SubmitButton>
  </ReviewForm>
)}
      <ReviewsSection>
  <h2>Customer Reviews</h2>
  {reviews.length > 0 ? (
    reviews.map((review) => (
      <ReviewCard key={review.id}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ReviewAvatar>
            {review.First_Name?.charAt(0)}
          </ReviewAvatar>
          <div>
            <ReviewerName>{review.First_Name} {review.Last_Name}</ReviewerName>
            <ReviewRating>
              <Rating value={review.Rating} readOnly size="small" />
            </ReviewRating>
          </div>
        </div>
        <ReviewText>{review.Review}</ReviewText>
      </ReviewCard>
    ))
  ) : (
    <p>No reviews yet. Be the first to review!</p>
  )}
</ReviewsSection>
    </Container>
  );
}

// Styled components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
`;

const Breadcrumb = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
  
  span {
    color: #0066c0;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
      color: #c45500;
    }
  }
`;

const ProductContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageGallery = styled.div`
  flex: 1;
`;

const MainImage = styled.div`
  img {
    width: 100%;
    max-width: 500px;
    height: auto;
    object-fit: contain;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Thumbnail = styled.div`
  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 4px;
    
    &:hover {
      border-color: #fa8900;
    }
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  padding: 0 20px;
`;

const BrandText = styled.div`
  font-size: 14px;
  color: #555;
  margin: 5px 0;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const RatingText = styled.span`
  margin-left: 10px;
  font-size: 14px;
  color: #0066c0;
`;

const PriceContainer = styled.div`
  position: relative;
  margin: 15px 0;
`;

const Price = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #B12704;
`;

const OriginalPrice = styled.span`
  font-size: 16px;
  color: #555;
  text-decoration: line-through;
  margin-right: 10px;
`;

const DiscountBadge = styled.span`
  background-color: #CC0C39;
  color: white;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 3px;
  margin-left: 10px;
`;

const Availability = styled.div`
  margin: 15px 0;
  font-size: 18px;
`;

const InStock = styled.span`
  color: #007600;
`;

const OutOfStock = styled.span`
  color: #CC0C39;
`;

const ProductMeta = styled.div`
  background-color: #f3f3f3;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
`;

const MetaItem = styled.div`
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
`;

const MetaLabel = styled.div`
  font-weight: bold;
  min-width: 100px;
`;

const MetaValue = styled.div`
  color: #555;
`;

const DescriptionText = styled.div`
  margin: 20px 0;
  line-height: 1.6;
  
  h3 {
    margin-bottom: 10px;
    font-size: 18px;
  }
  
  ul {
    margin-top: 10px;
    padding-left: 20px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const AddToCartButton = styled.button`
  padding: 10px 20px;
  background-color: #FFD814;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  
  &:hover {
    background-color: #F7CA00;
  }
`;

const BuyNowButton = styled.button`
  padding: 10px 20px;
  background-color: #FFA41C;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  
  &:hover {
    background-color: #FA8900;
  }
`;

const AdditionalInfo = styled.div`
  margin: 40px 0;
  border-top: 1px solid #ddd;
  padding-top: 20px;
`;

const InfoSection = styled.div`
  margin-bottom: 30px;
  
  h3 {
    font-size: 18px;
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
  }
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  tr {
    border-bottom: 1px solid #eee;
  }
  
  td {
    padding: 10px 5px;
    vertical-align: top;
    
    &:first-child {
      font-weight: bold;
      width: 150px;
    }
  }
`;



const AddReviewButton = styled.button`
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #007185;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ReviewForm = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #ffa41c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ReviewsSection = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ddd;

  h2 {
    font-size: 22px;
    margin-bottom: 20px;
    color: #111;
  }
`;

const ReviewCard = styled.div`
  background-color: #fdfdfd;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.04);
`;

const ReviewerName = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
`;

const ReviewText = styled.p`
  font-size: 15px;
  line-height: 1.5;
  color: #333;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const ReviewAvatar = styled.div`
  background-color: #007185;
  color: white;
  width: 35px;
  height: 35px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 16px;
`;


export default ProductDetails;