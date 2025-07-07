create database project_arraymazon

go 

use project_arraymazon

go

alter table Products add imageurl varchar(200) not null;
ALTER TABLE cart
ADD CONSTRAINT UQ_Buyer_Product UNIQUE (Buyer_ID, Product_ID, Category_ID);

select* from Products
select* from Reviews
select* from Transactions

delete from Products where Category_ID=2;


CREATE TABLE Buyers (
    Buyer_ID INT IDENTITY(1,1), 
    First_Name VARCHAR(50) NOT NULL, 
    Last_Name VARCHAR(50) NOT NULL, 
    CNIC CHAR(13), 
    DOB DATE, 
    Gender CHAR(1), 
    Phone_NO VARCHAR(15), 
    B_Address VARCHAR(200), 
    Username VARCHAR(50) NOT NULL, 
    B_Password VARCHAR(255) NOT NULL, 
    Wallet DECIMAL(10,2) NOT NULL
);

ALTER TABLE Buyers ADD CONSTRAINT PK_Buyer PRIMARY KEY (Buyer_ID);
ALTER TABLE Buyers ADD CONSTRAINT chk_gender CHECK (Gender IN ('M', 'F'));
ALTER TABLE Buyers ADD CONSTRAINT unique_b_username UNIQUE (Username);
ALTER TABLE Buyers ADD CONSTRAINT unique_b_CNIC UNIQUE (CNIC);
ALTER TABLE Buyers ADD CONSTRAINT unique_b_Phone UNIQUE (Phone_NO);
ALTER TABLE Buyers ADD CONSTRAINT DEFAULT_BW DEFAULT 0.00 FOR Wallet;

--------------------------------------------------------------------------
/* Add, Update and Delete a Seller */
CREATE TABLE Seller (
    Seller_ID INT IDENTITY(1,1), 
    First_Name VARCHAR(50) NOT NULL, 
    Last_Name VARCHAR(50) NOT NULL, 
    CNIC CHAR(13), 
    DOB DATE, 
    Gender CHAR(1), 
    Phone_NO VARCHAR(15), 
    S_Address VARCHAR(200), 
    Username VARCHAR(50) NOT NULL, 
    S_Password VARCHAR(255) NOT NULL, 
    Wallet DECIMAL(10,2) NOT NULL
);

ALTER TABLE Seller ADD CONSTRAINT PK_Seller PRIMARY KEY (Seller_ID);
ALTER TABLE Seller ADD CONSTRAINT s_chk_gender CHECK (Gender IN ('M', 'F'));
ALTER TABLE Seller ADD CONSTRAINT unique_s_username UNIQUE (Username);
ALTER TABLE Seller ADD CONSTRAINT unique_s_CNIC UNIQUE (CNIC);
ALTER TABLE Seller ADD CONSTRAINT unique_s_Phone UNIQUE (Phone_NO);
ALTER TABLE Seller ADD CONSTRAINT DEFAULT_SW DEFAULT 0.00 FOR Wallet;

--------------------------------------------------------------------------
/* Categories for helping in filter search */
CREATE TABLE Categories (
    Category_ID INT IDENTITY(1,1),
    Category_Name VARCHAR(30) NOT NULL
);

ALTER TABLE Categories ADD CONSTRAINT PK_Category PRIMARY KEY (Category_ID);
INSERT INTO Categories (Category_Name)
VALUES ('Fashion and Accessories'),
       ('Electronics'),
       ('Stationary'),
       ('Groceries'),
       ('Music'),
       ('Sports'),
       ('Video Games');


CREATE TABLE Sizes (
    Size_ID INT IDENTITY(1,1),
    Size VARCHAR(10) NOT NULL
);

CREATE TABLE Colors (
    Color_ID INT IDENTITY(1,1),
    Color VARCHAR(20) NOT NULL
);

CREATE TABLE Materials (
    Material_ID INT IDENTITY(1,1),
    Material VARCHAR(50) NOT NULL
);

CREATE TABLE Brands (
    Brand_ID INT IDENTITY(1,1),
    Brand VARCHAR(50) NOT NULL
);

-- Add Primary Key and Unique Constraint for Sizes
ALTER TABLE Sizes 
ADD CONSTRAINT PK_Sizes PRIMARY KEY (Size_ID);

ALTER TABLE Sizes 
ADD CONSTRAINT UQ_Sizes UNIQUE (Size);

-- Add Primary Key and Unique Constraint for Colors
ALTER TABLE Colors 
ADD CONSTRAINT PK_Colors PRIMARY KEY (Color_ID);

ALTER TABLE Colors 
ADD CONSTRAINT UQ_Colors UNIQUE (Color);

-- Add Primary Key and Unique Constraint for Materials
ALTER TABLE Materials 
ADD CONSTRAINT PK_Materials PRIMARY KEY (Material_ID);

ALTER TABLE Materials 
ADD CONSTRAINT UQ_Materials UNIQUE (Material);

-- Add Primary Key and Unique Constraint for Brands
ALTER TABLE Brands 
ADD CONSTRAINT PK_Brands PRIMARY KEY (Brand_ID);

ALTER TABLE Brands 
ADD CONSTRAINT UQ_Brands UNIQUE (Brand);
--------------------------------------------------------------------------
/* Add new products and modify their properties */
CREATE TABLE Products (
    Category_ID INT NOT NULL,
    Product_ID INT IDENTITY(1,1),
    Seller_ID INT NOT NULL,
    Product_Name VARCHAR(50) NOT NULL,
    Date_placed DATETIME,
    P_Description VARCHAR(150),
    Discount INT,
    Cost DECIMAL(10,2) NOT NULL,
    Quantity INT,
    Size_ID INT,
    Color_ID INT,
    Material_ID INT,
    Brand_ID INT,
    Best_Before_Or_Warranty DATE,
    Genre VARCHAR(25)
);

ALTER TABLE Products ADD CONSTRAINT PK_Products PRIMARY KEY (Product_ID, Category_ID);
ALTER TABLE Products ADD CONSTRAINT FK_Products_Category FOREIGN KEY (Category_ID) REFERENCES Categories (Category_ID) 
ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Products ADD CONSTRAINT FK_Products_Seller FOREIGN KEY (Seller_ID) REFERENCES Seller (Seller_ID) 
ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE Products ADD CONSTRAINT FK_Products_size FOREIGN KEY (Size_ID) REFERENCES Sizes (Size_ID) 
ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Products ADD CONSTRAINT FK_Products_color FOREIGN KEY (Color_ID) REFERENCES Colors (Color_ID) 
ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Products ADD CONSTRAINT FK_Products_material FOREIGN KEY (Material_ID) REFERENCES Materials (Material_ID) 
ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Products ADD CONSTRAINT FK_Products_brand FOREIGN KEY (Brand_ID) REFERENCES Brands (Brand_ID) 
ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Products ADD CONSTRAINT DEFAULT_PD DEFAULT 0 FOR Discount;
ALTER TABLE Products ADD CONSTRAINT DEFAULT_PQ DEFAULT 0 FOR Quantity;
ALTER TABLE Products ADD CONSTRAINT DEFAULT_PC DEFAULT 0.00 FOR Cost;
ALTER TABLE Products ADD CONSTRAINT DEFAULT_DP DEFAULT SYSDATETIME() FOR Date_placed;
ALTER TABLE Products ADD CONSTRAINT chk_stock CHECK (Quantity >= 0);

----------------------------------------------------------------------------------------------------------------------
/* Keep track of all transactions made */
CREATE TABLE Transactions (
    Transaction_ID INT IDENTITY(1,1),
    Product_ID INT NOT NULL,
    Category_ID INT NOT NULL,
    Seller_ID INT NOT NULL,
    Buyer_ID INT NOT NULL,                   
    Price_bought DECIMAL (10,2) NOT NULL,
    Date_bought DATETIME NOT NULL,
    Quantity INT
);

ALTER TABLE Transactions ADD CONSTRAINT PK_Transactions PRIMARY KEY (Transaction_ID, Date_bought);
ALTER TABLE Transactions ADD CONSTRAINT FK_Trans_Buyer FOREIGN KEY (Buyer_ID) REFERENCES Buyers (Buyer_ID) 
ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE Transactions ADD CONSTRAINT FK_Trans_Seller FOREIGN KEY (Seller_ID) REFERENCES Seller (Seller_ID) 
ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE Transactions ADD CONSTRAINT FK_Trans_Product FOREIGN KEY (Product_ID,  Category_ID) REFERENCES Products (Product_ID,  Category_ID)
ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Transactions ADD CONSTRAINT DEFAULT_TD DEFAULT SYSDATETIME() FOR Date_bought;

----------------------------------------------------------------------------
/* Payment Table */
CREATE TABLE Payments (
    Payment_ID INT IDENTITY(1,1),
    Transaction_ID INT NOT NULL,
    Date_bought DATETIME NOT NULL,
    Payment_Status VARCHAR(20) 
);

ALTER TABLE Payments ADD CONSTRAINT PK_Payments PRIMARY KEY (Payment_ID);
ALTER TABLE Payments ADD CONSTRAINT FK_Payment_Transaction FOREIGN KEY (Transaction_ID, Date_bought) REFERENCES Transactions (Transaction_ID,Date_bought)
ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE Payments ADD CONSTRAINT chk_status CHECK (Payment_Status IN ('Pending', 'Completed', 'Failed'))
ALTER TABLE Payments ADD CONSTRAINT DEFAULT_DB DEFAULT SYSDATETIME() FOR Date_bought;
----------------------------------------------------------------------------
/*Cart*/
CREATE TABLE Cart (
    Cart_ID INT IDENTITY(1,1),
	Buyer_ID INT NOT NULL,
	Product_ID INT NOT NULL,
	Category_ID INT NOT NULL
);
ALTER TABLE Cart ADD CONSTRAINT PK_CART PRIMARY KEY (Cart_ID, Buyer_ID, Product_ID, Category_ID);
ALTER TABLE Cart ADD CONSTRAINT FK_Cart_B FOREIGN KEY (Buyer_ID) REFERENCES Buyers (Buyer_ID)
ON DELETE NO ACTION ON UPDATE NO ACTION
ALTER TABLE Cart ADD CONSTRAINT FK_Cart_P FOREIGN KEY (Product_ID,  Category_ID) REFERENCES Products (Product_ID,  Category_ID)
ON DELETE CASCADE ON UPDATE CASCADE
----------------------------------------------------------------------------
/* Keeps track of all the reviews on products */
CREATE TABLE Reviews (
    Buyer_ID INT NOT NULL,
    Product_ID INT NOT NULL,
    Category_ID INT NOT NULL,
    Review VARCHAR(250),
    Date_Reviewed DATETIME,
    Rating FLOAT
);

ALTER TABLE Reviews ADD CONSTRAINT PK_Reviews PRIMARY KEY (Buyer_ID, Product_ID, Category_ID);
ALTER TABLE Reviews ADD CONSTRAINT FK_Rev_Buyer FOREIGN KEY (Buyer_ID) REFERENCES Buyers (Buyer_ID) 
ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE Reviews ADD CONSTRAINT FK_Rev_Product FOREIGN KEY (Product_ID,  Category_ID) REFERENCES Products (Product_ID,  Category_ID)
ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Reviews ADD CONSTRAINT chk_rating CHECK (Rating BETWEEN 1 AND 10);
ALTER TABLE Reviews ADD CONSTRAINT DEFAULT_DR DEFAULT SYSDATETIME() FOR Date_Reviewed  
---------------------------------------------------------------------------- 



---------------------------------------------------- Queries DDL --------------------------------------------------------------------------------\

-- Fixed insertions 
INSERT INTO Sizes (Size) VALUES 
('XS'),
('S'),
('M'),
('L'),
('XL'),
('XXL'),
('3XL'),
('4XL'),
('One Size'),
('Adjustable');


INSERT INTO Brands (Brand) VALUES 
('Nike'),
('Adidas'),
('Samsung'),
('Apple'),
('Sony'),
('LG'),
('Gucci'),
('Puma'),
('Zara'),
('Ray-Ban'),
('Levi\''s'),
('Casio'),
('Under Armour'),
('HP'),
('Dell');

INSERT INTO Materials (Material) VALUES 
('Cotton'),
('Polyester'),
('Leather'),
('Denim'),
('Silk'),
('Wool'),
('Nylon'),
('Linen'),
('Faux Fur'),
('Plastic'),
('Metal'),
('Glass'),
('Wood'),
('Rubber'),
('Carbon Fiber');

INSERT INTO Colors (Color) VALUES 
('Red'),
('Blue'),
('Green'),
('Black'),
('White'),
('Yellow'),
('Purple'),
('Pink'),
('Orange'),
('Gray'),
('Brown'),
('Beige'),
('Maroon'),
('Turquoise'),
('Navy Blue');


-- Data insertions (Seller, Buyers, Products, Reviews, Transactions, Payments)
INSERT INTO Seller (First_Name, Last_Name, CNIC, DOB, Gender, Phone_NO, S_Address, Username, S_Password) 
VALUES 
('John', 'Doe', '1234567890123', '1990-05-15', 'M', '03123456789', '123 Street', 'seller_john', 'password123'),
('Alice', 'Smith', '9876543210987', '1985-08-25', 'F', '03219876543', '456 Avenue', 'seller_alice', 'alicepass');

INSERT INTO Buyers (First_Name, Last_Name, CNIC, DOB, Gender, Phone_NO, B_Address, Username, B_Password) 
VALUES 
('Michael', 'Brown', '1112233445566', '2000-01-10', 'M', '03451234567', '789 Road', 'michael_b', 'michaelpass'),
('Emma', 'Davis', '2223344556677', '1995-07-20', 'F', '03556781234', '147 Blvd', 'emma_d', 'emmapass');


INSERT INTO Products (Category_ID, Seller_ID, Product_Name, Date_placed, P_Description, Discount, Cost, Quantity, Size_ID, Color_ID, Material_ID, Brand_ID, Best_Before_Or_Warranty, Genre) 
VALUES 
(1, 2, 'Leather Jacket', SYSDATETIME(), 'Genuine leather jacket', 10, 120.00, 15, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 2, 'Wireless Headphones', SYSDATETIME(), 'Noise-canceling headphones', 5, 200.00, 10, NULL, NULL, NULL, NULL, '2026-12-31', NULL);
INSERT INTO Products (Category_ID, Seller_ID, Product_Name, Date_placed, P_Description, Discount, Cost, Quantity, Size_ID, Color_ID, Material_ID, Brand_ID, Best_Before_Or_Warranty, Genre) 
VALUES 
(1, 1, 'Running Shoes', SYSDATETIME(), 'Lightweight and comfortable running shoes', 15, 90.00, 20, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO Reviews (Buyer_ID, Product_ID, Category_ID, Review, Date_Reviewed, Rating) 
VALUES 
(1, 1, 1, 'Great quality jacket!', '2025-03-01 10:00:00', 9),
(2, 1, 1, 'Very stylish and comfortable.', '2025-03-02 15:30:00', 8),
(1, 2, 2, 'Good sound but a bit expensive.', '2025-03-03 12:45:00', 7),
(2, 2, 2, 'Amazing noise cancellation!', '2025-03-04 18:20:00', 10);


-- Transactions Table
INSERT INTO Transactions (Product_ID, Category_ID, Seller_ID, Buyer_ID, Price_bought, Date_bought, Quantity) 
VALUES 
(1, 1, 2, 1, 120.00, '2025-03-05 14:00:00', 1),
(1, 1, 2, 2, 216.00, '2025-03-06 10:30:00', 2), -- 10% discount applied
(2, 2, 2, 1, 190.00, '2025-03-07 16:20:00', 1), -- 5% discount applied
(2, 2, 2, 2, 190.00, '2025-03-08 12:10:00', 1)

-- Payments Table
INSERT INTO Payments (Transaction_ID, Date_bought, Payment_Status) 
VALUES 
(1, '2025-03-05 14:00:00', 'Completed'),
(2, '2025-03-06 10:30:00', 'Completed'),
(3, '2025-03-07 16:20:00', 'Completed'),
(4, '2025-03-08 12:10:00', 'Completed')


-------------------------------------------  End of DDL --------------------------------


------------------------------------------- DQL Queries --------------------------------
--1)
--Customer Reviews Summary ? Show average ratings and reviews for a seller's products.
SELECT 
    P.Seller_ID, 
    S.First_Name + ' ' + S.Last_Name AS Name,      -- Added Seller's Name
    P.Product_ID, 
    P.Product_Name, 
    C.Category_Name,
    R.Buyer_ID,
    B.Username AS Buyer_Username, -- Added Buyer's Username
    R.Review,
    R.Rating,
    R.Date_Reviewed,
    AVG(R.Rating) OVER (PARTITION BY P.Product_ID) AS Average_Rating
FROM Reviews R
JOIN Products P ON R.Product_ID = P.Product_ID AND R.Category_ID = P.Category_ID
JOIN Categories C ON P.Category_ID = C.Category_ID
JOIN Seller S ON P.Seller_ID = S.Seller_ID  -- Join with Sellers table to get Seller_Name
JOIN Buyers B ON R.Buyer_ID = B.Buyer_ID      -- Join with Buyers table to get Buyer_Username
WHERE P.Seller_ID = 2
ORDER BY P.Product_ID, R.Date_Reviewed DESC;

--2)
--Category-Based Bestsellers ? Display the top-selling products in each category.

WITH RankedProducts AS (
    SELECT 
        P.Product_ID, 
        P.Product_Name,
        C.Category_ID, 
        C.Category_Name,
        SUM(T.Quantity) AS Total_Sold,
        RANK() OVER (PARTITION BY C.Category_ID ORDER BY SUM(T.Quantity) DESC) AS Sales_Rank
    FROM Transactions T
    JOIN Products P ON T.Product_ID = P.Product_ID AND T.Category_ID = P.Category_ID
    JOIN Categories C ON P.Category_ID = C.Category_ID
    GROUP BY P.Product_ID, P.Product_Name, C.Category_ID, C.Category_Name
)
SELECT * FROM RankedProducts WHERE Sales_Rank = 1;


--3)
--Product Recommendations (basic) ? Show similar products based on category and brand.

WITH SimilarProducts AS (
    SELECT 
        P1.Product_ID AS Original_Product_ID, 
        P1.Product_Name AS Original_Product_Name,
        P2.Product_ID AS Recommended_Product_ID,
        P2.Product_Name AS Recommended_Product_Name,
        P2.Category_ID,
        P2.Brand_ID
    FROM Products P1
    JOIN Products P2 
        ON P1.Category_ID = P2.Category_ID 
        AND P1.Brand_ID = P2.Brand_ID 
        AND P1.Product_ID <> P2.Product_ID
    WHERE P1.Product_ID = 1
)
SELECT * FROM SimilarProducts;

--4)
--Total Sales Revenue per Month ? Aggregate transactions by month.

SELECT 
    FORMAT(Date_bought, 'yyyy-MM') AS Month,
    SUM(Price_bought) AS Total_Revenue
FROM Transactions
GROUP BY FORMAT(Date_bought, 'yyyy-MM')
ORDER BY Month;

--5)
--Pending Payments ? List orders where the payment status is "Pending."
SELECT 
    P.Payment_ID,
    T.Transaction_ID,
    B.Buyer_ID,
    B.First_Name + ' ' + B.Last_Name AS Buyer_Name,
    S.Seller_ID,
    S.First_Name + ' ' + S.Last_Name AS Seller_Name,
    PR.Product_ID,
    PR.Product_Name,
    T.Quantity,
    T.Price_bought,
    T.Date_bought,
    P.Payment_Status
FROM Payments P
JOIN Transactions T ON P.Transaction_ID = T.Transaction_ID
JOIN Buyers B ON T.Buyer_ID = B.Buyer_ID
JOIN Seller S ON T.Seller_ID = S.Seller_ID
JOIN Products PR ON T.Product_ID = PR.Product_ID
WHERE P.Payment_Status = 'Pending'
ORDER BY T.Date_bought DESC;

--6)
--Buyer Spending Analysis ? Show total amount spent by a buyer in a given period.
SELECT 
    T.Buyer_ID,
    B.First_Name + ' ' + B.Last_Name AS Buyer_Name,
    SUM(T.Price_bought) AS Total_Spent
FROM Transactions T
JOIN Buyers B ON T.Buyer_ID = B.Buyer_ID
WHERE T.Date_bought BETWEEN '2024-01-01' AND '2025-03-31' -- Change dates as needed
GROUP BY T.Buyer_ID, B.First_Name, B.Last_Name
ORDER BY Total_Spent DESC;

--7)
--Most Helpful Reviews ? Rank reviews with the highest rating.

SELECT 
    R.Product_ID, 
    P.Product_Name, 
    R.Buyer_ID, 
    B.First_Name + ' ' + B.Last_Name AS Buyer_Name, 
    R.Review, 
    R.Rating, 
    R.Date_Reviewed
FROM Reviews R
JOIN Buyers B ON R.Buyer_ID = B.Buyer_ID
JOIN Products P ON R.Product_ID = P.Product_ID
ORDER BY R.Rating DESC, R.Date_Reviewed DESC; -- Highest rating first, latest reviews in case of ties


--8)
--  Average Product Rating  
SELECT 
    P.Product_ID, 
    P.Product_Name, 
    P.Category_ID, 
    AVG(R.Rating) AS Avg_Rating
FROM Products P
LEFT JOIN Reviews R ON P.Product_ID = R.Product_ID AND P.Category_ID = R.Category_ID
GROUP BY P.Product_ID, P.Product_Name, P.Category_ID;

--9)
-- Negative Feedback Analysis (Products with consistently low ratings ? 3)  
SELECT 
    P.Product_ID, 
    P.Product_Name, 
    P.Category_ID, 
    AVG(R.Rating) AS Avg_Rating,
    COUNT(R.Review) AS Total_Reviews
FROM Products P
INNER JOIN Reviews R ON P.Product_ID = R.Product_ID AND P.Category_ID = R.Category_ID
GROUP BY P.Product_ID, P.Product_Name, P.Category_ID
HAVING AVG(R.Rating) <= 3;

--10)
-- Recent Reviews for a Product (latest 5 reviews)  
DECLARE @Product_ID INT = 1, @Category_ID INT = 1; -- Replace with actual values
SELECT TOP 5 
    R.Buyer_ID, 
    R.Product_ID, 
    R.Category_ID, 
    R.Review, 
    R.Date_Reviewed, 
    R.Rating
FROM Reviews R
WHERE R.Product_ID = @Product_ID AND R.Category_ID = @Category_ID
ORDER BY R.Date_Reviewed DESC;


--11)
-- Products in stock but never sold  
SELECT 
    P.Product_ID, 
    P.Product_Name, 
    P.Category_ID, 
    P.Quantity
FROM Products P
WHERE NOT EXISTS (
    SELECT 1 FROM Transactions T 
    WHERE P.Product_ID = T.Product_ID AND P.Category_ID = T.Category_ID
) 
AND P.Quantity > 0;

--12)
-- Sellers with the most out-of-stock products  
SELECT TOP 5
    P.Seller_ID, 
    S.First_Name, 
    S.Last_Name, 
    COUNT(P.Product_ID) AS Out_Of_Stock_Count
FROM Products P
INNER JOIN Seller S ON P.Seller_ID = S.Seller_ID
WHERE P.Quantity = 0
GROUP BY P.Seller_ID, S.First_Name, S.Last_Name
ORDER BY Out_Of_Stock_Count DESC;

--13)
-- Buyers who left bad reviews (rating ? 3) for multiple products from the same seller  
SELECT 
    R.Buyer_ID, 
    P.Seller_ID, 
    COUNT(DISTINCT R.Product_ID) AS Bad_Review_Count
FROM Reviews R
INNER JOIN Products P ON R.Product_ID = P.Product_ID AND R.Category_ID = P.Category_ID
WHERE R.Rating <= 3
GROUP BY R.Buyer_ID, P.Seller_ID
HAVING COUNT(DISTINCT R.Product_ID) > 1;

--14)
-- Monthly revenue trend for the last 6 months  
SELECT 
    FORMAT(T.Date_bought, 'yyyy-MM') AS Month,
    SUM(T.Price_bought * T.Quantity) AS Monthly_Revenue
FROM Transactions T
WHERE T.Date_bought >= DATEADD(MONTH, -6, GETDATE())
GROUP BY FORMAT(T.Date_bought, 'yyyy-MM')
ORDER BY Month;

--15)
-- Buyers who only buy from a single category  
SELECT 
    T.Buyer_ID, 
    COUNT(DISTINCT T.Category_ID) AS Unique_Categories
FROM Transactions T
GROUP BY T.Buyer_ID
HAVING COUNT(DISTINCT T.Category_ID) = 1;

--16)
-- Buyers who have never made a purchase (inactive buyers)  
SELECT 
    B.Buyer_ID, 
    B.First_Name, 
    B.Last_Name
FROM Buyers B
WHERE NOT EXISTS (
    SELECT 1 FROM Transactions T 
    WHERE B.Buyer_ID = T.Buyer_ID
);

--17)
 --Top 5 Best-Selling Products(Rank products based on the number of transactions)
SELECT TOP 5 
    P.Product_ID, 
    P.Product_Name, 
    COUNT(T.Transaction_ID) AS Total_Sales
FROM Transactions T
JOIN Products P ON T.Product_ID = P.Product_ID
GROUP BY P.Product_ID, P.Product_Name
ORDER BY Total_Sales DESC;

--18)
--Products with Highest Discounts(Show products with the biggest percentage discount)
SELECT 
    Product_ID, 
    Product_Name, 
    Discount, 
    Cost, 
    (Discount / NULLIF(Cost, 0)) * 100 AS Discount_Percentage
FROM Products
ORDER BY Discount_Percentage DESC;

--19)
-- Buyer's Purchase History(Retrieve all past orders for a specific buyer)
SELECT 
    T.Transaction_ID, 
    P.Product_Name, 
    T.Quantity, 
    T.Price_bought, 
    T.Date_bought
FROM Transactions T
JOIN Products P ON T.Product_ID = P.Product_ID
WHERE T.Buyer_ID = @Buyer_ID
ORDER BY T.Date_bought DESC;

--20)
-- Cart Summary
(Show total cost of all items in a buyer’s cart)
SELECT 
    C.Buyer_ID, 
    SUM(P.Cost) AS Total_Cart_Cost
FROM Cart C
JOIN Products P ON C.Product_ID = P.Product_ID
WHERE C.Buyer_ID = @Buyer_ID
GROUP BY C.Buyer_ID;

--21)
--Top-Selling Sellers(Rank sellers by the number of sales)
SELECT TOP 5 
    S.Seller_ID, 
    S.First_Name + ' ' + S.Last_Name AS Seller_Name, 
    COUNT(T.Transaction_ID) AS Total_Sales
FROM Transactions T
JOIN Seller S ON T.Seller_ID = S.Seller_ID
GROUP BY S.Seller_ID, S.First_Name, S.Last_Name
ORDER BY Total_Sales DESC;

--22)
-- Sellers with the Highest Number of Unique Buyers
SELECT TOP 5 
    S.Seller_ID, 
    S.First_Name + ' ' + S.Last_Name AS Seller_Name, 
    COUNT(DISTINCT T.Buyer_ID) AS Unique_Buyers
FROM Transactions T
JOIN Seller S ON T.Seller_ID = S.Seller_ID
GROUP BY S.Seller_ID, S.First_Name, S.Last_Name
ORDER BY Unique_Buyers DESC;


--23)
-- Sellers Whose Products Have the Most Discounts Applied
SELECT 
    S.Seller_ID, 
    S.First_Name + ' ' + S.Last_Name AS Seller_Name, 
    COUNT(P.Product_ID) AS Discounted_Products
FROM Products P
JOIN Seller S ON P.Seller_ID = S.Seller_ID
WHERE P.Discount > 0
GROUP BY S.Seller_ID, S.First_Name, S.Last_Name
ORDER BY Discounted_Products DESC;

--24)
-- Low Stock Alerts(Show products with stock levels below a threshold, e.g., 5)
SELECT 
    P.Product_ID, 
    P.Product_Name, 
    P.Quantity, 
    S.First_Name + ' ' + S.Last_Name AS Seller_Name
FROM Products P
JOIN Seller S ON P.Seller_ID = S.Seller_ID
WHERE P.Quantity < 5
ORDER BY P.Quantity ASC;

----------------------------------------- Procedures --------------------------------

--user authentication procedures 
go
CREATE PROCEDURE sp_AuthenticateUser
    @Username VARCHAR(50),
    @Password VARCHAR(255),
    @UserType VARCHAR(10) -- 'buyer' or 'seller'
AS
BEGIN
    IF @UserType = 'buyer'
    BEGIN
        SELECT Buyer_ID AS UserID, Username, 'buyer' AS UserType 
        FROM Buyers 
        WHERE Username = @Username AND B_Password = @Password;
    END
    ELSE IF @UserType = 'seller'
    BEGIN
        SELECT Seller_ID AS UserID, Username, 'seller' AS UserType 
        FROM Seller 
        WHERE Username = @Username AND S_Password = @Password;
    END
END;



--sales report procedure 
go
CREATE PROCEDURE sp_GenerateSalesReport
    @SellerID INT = NULL,
    @StartDate DATETIME = NULL,
    @EndDate DATETIME = NULL,
    @CategoryID INT = NULL
AS
BEGIN
    SELECT 
        p.Product_ID,
        p.Product_Name,
        c.Category_Name,
        COUNT(t.Transaction_ID) AS Units_Sold,
        SUM(t.Quantity) AS Total_Quantity,
        SUM(t.Price_bought * t.Quantity) AS Total_Revenue,
        AVG(t.Price_bought) AS Average_Price,
        MIN(t.Date_bought) AS First_Sale_Date,
        MAX(t.Date_bought) AS Last_Sale_Date
    FROM Transactions t
    JOIN Products p ON t.Product_ID = p.Product_ID AND t.Category_ID = p.Category_ID
    JOIN Categories c ON p.Category_ID = c.Category_ID
    WHERE 
        (@SellerID IS NULL OR t.Seller_ID = @SellerID)	
        AND (@StartDate IS NULL OR CONVERT(DATE, t.Date_bought) >= @StartDate)
        AND (@EndDate IS NULL OR CONVERT(DATE, t.Date_bought) <= @EndDate)
        AND (@CategoryID IS NULL OR p.Category_ID = @CategoryID)
    GROUP BY p.Product_ID, p.Product_Name, c.Category_Name
    ORDER BY Total_Revenue DESC;
END;


EXEC sp_GenerateSalesReport @CategoryID = 1, @StartDate = '2025-01-01', @EndDate = '2025-03-31';

go
CREATE PROCEDURE sp_ProcessPurchase
    @BuyerID INT,
    @ProductID INT,
    @CategoryID INT,
    @Quantity INT,
    @PaymentStatus VARCHAR(20) = 'Pending'
AS
BEGIN
    DECLARE @SellerID INT, @Price DECIMAL(10,2), @TotalCost DECIMAL(10,2);
    DECLARE @TransactionID INT;
    
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Get product details and verify stock
        SELECT @SellerID = Seller_ID, @Price = Cost 
        FROM Products 
        WHERE Product_ID = @ProductID AND Category_ID = @CategoryID AND Quantity >= @Quantity;
        
        IF @SellerID IS NULL
        BEGIN
            ROLLBACK;
            RETURN -1; -- Product not found or insufficient stock
        END
        
        SET @TotalCost = @Price * @Quantity;
        
        -- Create transaction
        INSERT INTO Transactions (Product_ID, Category_ID, Seller_ID, Buyer_ID, Price_bought, Quantity, Date_bought)
        VALUES (@ProductID, @CategoryID, @SellerID, @BuyerID, @Price, @Quantity, SYSDATETIME());
        
        SET @TransactionID = SCOPE_IDENTITY();
        
        -- Update product inventory
        UPDATE Products 
        SET Quantity = Quantity - @Quantity 
        WHERE Product_ID = @ProductID AND Category_ID = @CategoryID;
        
		IF EXISTS (SELECT 1 FROM Products WHERE Product_ID = @ProductID AND Quantity < 5)
        BEGIN
            PRINT '?? Low Stock Alert: Product ID ' + CAST(@ProductID AS VARCHAR) + ' is below threshold!';
        END
        -- Record payment
        INSERT INTO Payments (Transaction_ID, Date_bought, Payment_Status)
        VALUES (@TransactionID, SYSDATETIME(), @PaymentStatus);
        
        COMMIT;
        RETURN @TransactionID; -- Success
    END TRY
    BEGIN CATCH
        ROLLBACK;
        RETURN -2; -- Error occurred
    END CATCH
END;

DECLARE @Result INT;
EXEC @Result = sp_ProcessPurchase @BuyerID = 1, @ProductID = 1, @CategoryID = 1, @Quantity = 2, @PaymentStatus = 'Completed';
SELECT @Result AS Purchase_Result;

select * from Products
select * from Transactions
select * from payments
--shopping cart checkout procedure 
go
CREATE PROCEDURE sp_CheckoutCart
    @BuyerID INT
AS
BEGIN
    DECLARE @CartItems TABLE (
        Cart_ID INT,
        Product_ID INT,
        Category_ID INT,
        Quantity INT DEFAULT 1
    );
    
    -- Get cart items
    INSERT INTO @CartItems (Cart_ID, Product_ID, Category_ID)
    SELECT Cart_ID, Product_ID, Category_ID FROM Cart WHERE Buyer_ID = @BuyerID;
    
    -- Process each item
    DECLARE @CurrentProductID INT, @CurrentCategoryID INT, @CartID INT;
    
    WHILE EXISTS (SELECT 1 FROM @CartItems WHERE Quantity > 0)
    BEGIN
        SELECT TOP 1 @CartID = Cart_ID, @CurrentProductID = Product_ID, @CurrentCategoryID = Category_ID 
        FROM @CartItems 
        WHERE Quantity > 0;
        
        -- Process purchase
        DECLARE @Result INT;
        EXEC @Result = sp_ProcessPurchase @BuyerID, @CurrentProductID, @CurrentCategoryID, 1;
        
        IF @Result > 0
        BEGIN
            -- Remove from cart if successful
            DELETE FROM Cart WHERE Cart_ID = @CartID;
            UPDATE @CartItems SET Quantity = 0 WHERE Cart_ID = @CartID;
        END
        ELSE
        BEGIN
            -- Mark as processed but not successful
            UPDATE @CartItems SET Quantity = -1 WHERE Cart_ID = @CartID;
        END
    END
    
    -- Return results
    SELECT 
        c.Product_ID,
        p.Product_Name,
        CASE 
            WHEN c.Quantity = 0 THEN 'Purchased' 
            WHEN c.Quantity = -1 THEN 'Failed'
            ELSE 'Pending'
        END AS Status
    FROM @CartItems c
    JOIN Products p ON c.Product_ID = p.Product_ID AND c.Category_ID = p.Category_ID;
END;

-- product search with filtering 
go
CREATE PROCEDURE sp_SearchProducts
    @SearchTerm VARCHAR(100) = NULL,
    @CategoryID INT = NULL,
    @MinPrice DECIMAL(10,2) = NULL,
    @MaxPrice DECIMAL(10,2) = NULL,
    @BrandID INT = NULL,
    @SizeID INT = NULL,
    @ColorID INT = NULL,
    @PageNumber INT = 1,
    @PageSize INT = 10
AS
BEGIN
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;
    
    SELECT 
        p.Product_ID,
        p.Product_Name,
        p.Cost,
        p.Discount,
        (p.Cost * (1 - p.Discount/100.0)) AS Final_Price,
        p.Quantity,
        c.Category_Name,
        b.Brand,
        sz.Size,
        cl.Color,
        s.First_Name + ' ' + s.Last_Name AS Seller_Name,
        COUNT(*) OVER() AS TotalCount
    FROM Products p
    JOIN Categories c ON p.Category_ID = c.Category_ID
    LEFT JOIN Brands b ON p.Brand_ID = b.Brand_ID
    LEFT JOIN Sizes sz ON p.Size_ID = sz.Size_ID
    LEFT JOIN Colors cl ON p.Color_ID = cl.Color_ID
    JOIN Seller s ON p.Seller_ID = s.Seller_ID
    WHERE 
        (@SearchTerm IS NULL OR p.Product_Name LIKE '%' + @SearchTerm + '%')
        AND (@CategoryID IS NULL OR p.Category_ID = @CategoryID)
        AND (@MinPrice IS NULL OR p.Cost >= @MinPrice)
        AND (@MaxPrice IS NULL OR p.Cost <= @MaxPrice)
        AND (@BrandID IS NULL OR p.Brand_ID = @BrandID)
        AND (@SizeID IS NULL OR p.Size_ID = @SizeID)
        AND (@ColorID IS NULL OR p.Color_ID = @ColorID)
    ORDER BY p.Product_Name
    OFFSET @Offset ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;

