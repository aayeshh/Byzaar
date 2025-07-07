import axios from "../axios";
import React, { useState } from "react";
import styled from "styled-components";
import { useStateValue } from "../StateProvider";
import { useNavigate } from "react-router-dom";
function AddProduct(){

  const navigate  = useNavigate();
  const [{user}] = useStateValue();
  const [categoryID, setCategoryID] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [cost, setCost] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sizeID, setSizeID] = useState('');
  const [colorID, setColorID] = useState('');
  const [materialID, setMaterialID] = useState('');
  const [brandID, setBrandID] = useState('');
  const [bestBeforeOrWarranty, setBestBeforeOrWarranty] = useState('');
  const [genre, setGenre] = useState('');
  const [imageURL, setimageURL] = useState('');

  const validateForm = () => {
    if (!productName.trim()) return "Product Name is required.";
    if (!cost || parseFloat(cost) <= 0) return "Cost must be a positive number.";
    if (!quantity || parseInt(quantity) < 1) return "Quantity must be at least 1.";
    if (discount && (discount < 0 || discount > 100)) return "Discount must be between 0 and 100.";
    if (imageURL && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/.test(imageURL)) return "Invalid image URL.";
    if (!categoryID) return "Category is required.";
    if (!materialID) return "Material is required.";
    if (!colorID) return "Color is required.";
  
    return null; // All good
  };
  const addProduct = (e) => {
    e.preventDefault();
  
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }
  
    const formData = {
      Category_ID: categoryID || null,
      Seller_ID: user?.UserID || null,
      Product_Name: productName || null,
      Cost: cost || null,
      Quantity: quantity || null,
      Size_ID: sizeID || null,
      Color_ID: colorID || null,
      Material_ID: materialID || null,
      Brand_ID: brandID || null,
      Discount: discount || null,
      P_Description: description || null,
      Best_Before_Or_Warranty: bestBeforeOrWarranty || null,
      Genre: genre || null,
      imageURL: imageURL || null,
    };
  
    axios
      .post("/api/products", formData)
      .then((response) => {
        if (response.status === 201) {
          alert("Product added successfully!");
          navigate("/seller");
        }
      })
      .catch((error) => {
        alert(error.response ? error.response.data.message : error.message);
      });
  };

    return (
        <Container>
            <Logo onClick={() => navigate("/")}>
                <img src="./Byzaar.jpg" alt="" />
            </Logo>

            <FormContainer>
                <h3>Add Product</h3>
                <GridContainer>

                <InputContainer>
                  <p>Category</p>
                  <select
                    onChange={(e) => setCategoryID(e.target.value)}
                    value={categoryID}
                  >
                    <option value="">Select a category</option>
                    <option value="1">Fashion and Accessories</option>
                    <option value="2">Electronics</option>
                    <option value="3">Stationary</option>
                    <option value="4">Groceries</option>
                    <option value="5">Music</option>
                    <option value="6">Sports</option>
                    <option value="7">Video Games</option>
                  </select>
                </InputContainer>

                <InputContainer>
                  <p>Product Name</p>
                  <input
                    type="text"
                    onChange={(e) => setProductName(e.target.value)}
                    value={productName}
                  />
                </InputContainer>

                <InputContainer>
                  <p>Description</p>
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  />
                </InputContainer>

                <InputContainer>
                  <p>Discount (%)</p>
                  <input
                    type="number"
                    onChange={(e) => setDiscount(e.target.value)}
                    value={discount}
                  />
                </InputContainer>

                <InputContainer>
                  <p>Cost</p>
                  <input
                    type="number"
                    step="0.01"
                    onChange={(e) => setCost(e.target.value)}
                    value={cost}
                  />
                </InputContainer>

                <InputContainer>
                  <p>Quantity</p>
                  <input
                    type="number"
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}
                  />
                </InputContainer>

                <InputContainer>
                  <p>Size</p>
                  <select
                    onChange={(e) => setSizeID(e.target.value)}
                    value={sizeID}
                  >
                    <option value="">Select a size</option>
                    <option value="1">XS</option>
                    <option value="2">S</option>
                    <option value="3">M</option>
                    <option value="4">L</option>
                    <option value="5">XL</option>
                    <option value="6">XXL</option>
                    <option value="7">3XL</option>
                    <option value="8">4XL</option>
                  </select>
                </InputContainer>


                <InputContainer>
                  <p>Color</p>
                  <select
                    onChange={(e) => setColorID(e.target.value)}
                    value={colorID}
                  >
                    <option value="">Select a color</option>
                    <option value="12">Beige</option>
                    <option value="4">Black</option>
                    <option value="2">Blue</option>
                    <option value="11">Brown</option>
                    <option value="10">Gray</option>
                    <option value="3">Green</option>
                    <option value="13">Maroon</option>
                    <option value="15">Navy Blue</option>
                    <option value="9">Orange</option>
                    <option value="8">Pink</option>
                    <option value="7">Purple</option>
                    <option value="1">Red</option>
                    <option value="14">Turquoise</option>
                    <option value="5">White</option>
                    <option value="6">Yellow</option>
                  </select>
                </InputContainer>


                <InputContainer>
                  <p>Material</p>
                  <select
                    onChange={(e) => setMaterialID(e.target.value)}
                    value={materialID}
                  >
                    <option value="">Select a material</option>
                    <option value="15">Carbon Fiber</option>
                    <option value="1">Cotton</option>
                    <option value="4">Denim</option>
                    <option value="9">Faux Fur</option>
                    <option value="12">Glass</option>
                    <option value="3">Leather</option>
                    <option value="8">Linen</option>
                    <option value="11">Metal</option>
                    <option value="7">Nylon</option>
                    <option value="10">Plastic</option>
                    <option value="2">Polyester</option>
                    <option value="14">Rubber</option>
                    <option value="5">Silk</option>
                    <option value="13">Wood</option>
                    <option value="6">Wool</option>
                  </select>
                </InputContainer>

                <InputContainer>
                  <p>Brand</p>
                  <select
                    onChange={(e) => setBrandID(e.target.value)}
                    value={brandID}
                  >
                    <option value="">Select a brand</option>
                    <option value="2">Adidas</option>
                    <option value="4">Apple</option>
                    <option value="12">Casio</option>
                    <option value="15">Dell</option>
                    <option value="7">Gucci</option>
                    <option value="14">HP</option>
                    <option value="11">Levi's</option>
                    <option value="6">LG</option>
                    <option value="1">Nike</option>
                    <option value="8">Puma</option>
                    <option value="10">Ray-Ban</option>
                    <option value="3">Samsung</option>
                    <option value="5">Sony</option>
                    <option value="13">Under Armour</option>
                    <option value="9">Zara</option>
                  </select>
                </InputContainer>



                <InputContainer>
                  <p>Best Before / Warranty</p>
                  <input
                    type="date"
                    onChange={(e) => setBestBeforeOrWarranty(e.target.value)}
                    value={bestBeforeOrWarranty}
                  />
                </InputContainer>

                <InputContainer>
                  <p>Genre</p>
                  <input
                    type="text"
                    onChange={(e) => setGenre(e.target.value)}
                    value={genre}
                  />
                </InputContainer>
                <InputContainer>
                  <p>Image</p>
                  <input
                    type="text"
                    onChange={(e) => setimageURL(e.target.value)}
                    value={imageURL}
                  />
                </InputContainer>
                </GridContainer>

                <Button onClick={addProduct}>Add Product</Button>
            </FormContainer>
        </Container>
    )
}

const Container = styled.div`
  width: 40%;
  min-width: 450px;
  height: fit-content;
  padding: 15px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.div`
  width: 200px;
  margin-bottom: 20px;
  cursor: pointer;

  img {
    width: 100%;
  }
`;


const FormContainer = styled.form`
  border: 1px solid lightgray;
  width: 155%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;

  h3 {
    font-size: 28px;
    font-weight: 400;
    line-height: 33px;
    align-self: flex-start;

    margin-bottom: 10px;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack columns on smaller screens */
  }
`;

const InputContainer = styled.div`
  width: 100%;
  padding: 10px;

  p {
    font-size: 14px;
    font-weight: 600;
  }

  input,
  select,
  textarea {
    width: 95%;
    height: 33px;
    padding-left: 5px;
    border-radius: 5px;
    border: 1px solid lightgray;
    margin-top: 5px;

    &:hover {
      border: 1px solid orange;
    }
  }

  textarea {
    height: 80px; /* Adjust height for textarea */
  }
`;

const Button = styled.button`
  width: 70%;
  height: 35px;
  background-color: #f3b414;
  border: none;
  outline: none;
  border-radius: 10px;
  margin-top: 30px;
`;
export default AddProduct;