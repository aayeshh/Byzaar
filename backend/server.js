const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const {sql, poolAmazon} = require('./db.js')
const {hashPassword, comparePassword} = require('./helperhasher.js')
const { authenticateSession, authorizeRole } = require("./authMiddleware.js");
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000", // your frontend origin
    credentials: true
}));
app.use(session({
    secret:'key that will sign the cookie',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60,
        
      secure: false, // true if using https
      httpOnly: true,
    }
    })
);
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.send("Hello session Tut");
});

app.listen(PORT, () => console.log('Server is running on \${PORT}'));



app.post("/api/login", async (req, res) => {
    try {
        const { username, password, userType } = req.body;
        
        if (!username || !password || !userType) {
            return res.status(400).json({ 
                success: false, 
                message: "Username, password and userType are required" 
            });
        }

        const pool = await poolAmazon;
        
        // First, fetch the user's hashed password from the database
        const userResult = await pool.request()
            .input("Username", sql.VarChar, username)
            .input("UserType", sql.VarChar, userType)
            .execute("sp_AuthenticateUser"); // You'll need to create this stored procedure

        if (userResult.recordset.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid username or user type" 
            });
        }
        
        console.log("User record from DB:", userResult.recordset[0]); // Check if S_Password exists
        const user = userResult.recordset[0];
        
        // Compare the provided password with the stored hashed password
        const isPasswordValid = comparePassword(password, user.PASSWORD); // Assuming the column is named S_Password

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid password" 
            });
        }
 
        // If we get here, credentials are valid
        // Store user info in the session
        req.session.user = {
            userId: user.UserID,
            username: user.Username,
            userType: user.UserType
        };

        res.status(200).json({ 
            success: true, 
            user: {
                UserID: user.UserID,
                Username: user.Username,
                UserType: user.UserType
                // Don't send back the password!
            } 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

app.delete("/api/cart", async (req, res) => {
    try {
        const { id, buyerID } = req.body;

        const pool = await poolAmazon;
        const result = await pool.request()
            .input("Product_ID", sql.Int, id)
            .input("Buyer_ID", sql.Int, buyerID)
            .query("DELETE FROM Cart WHERE Product_ID = @Product_ID AND Buyer_ID = @Buyer_ID");

        if (result.rowsAffected[0] === 0) {
            return res.status(403).json({ success: false, message: "Unauthorized. You can only delete your own cart entries." });
        }

        res.status(200).json({ success: true, message: "Cart entry deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.delete("/api/cart_buyer", async (req, res) => {
    try {
        const {buyerID } = req.body;

        const pool = await poolAmazon;
        const result = await pool.request()
            .input("Buyer_ID", sql.Int, buyerID)
            .query("DELETE FROM Cart WHERE Buyer_ID = @Buyer_ID");

        if (result.rowsAffected[0] === 0) {
            return res.status(403).json({ success: false, message: "Unauthorized. You can only delete your own cart entries." });
        }

        res.status(200).json({ success: true, message: "Cart entry deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post("/api/buyers", async (req, res) => {
    try {
        const { First_Name, Last_Name, CNIC, DOB, Gender, Phone_NO, B_Address, Username, B_Password } = req.body;

        if (!First_Name || !Last_Name || !Username || !B_Password) {
            return res.status(404).json({ success: false, message: "All fields are required." });
        }
        const pool = await poolAmazon;
        const result = await pool
            .request()
            .input("First_Name", sql.VarChar, First_Name)
            .input("Last_Name", sql.VarChar, Last_Name)
            .input("CNIC", sql.Char, CNIC)
            .input("DOB", sql.Date, DOB)
            .input("Gender", sql.Char, Gender)
            .input("Phone_NO", sql.VarChar, Phone_NO)
            .input("B_Address", sql.VarChar, B_Address)
            .input("Username", sql.VarChar, Username)
            .input("B_Password", sql.VarChar, hashPassword(B_Password))
            .query("INSERT INTO Buyers (First_Name, Last_Name, CNIC, DOB, Gender, Phone_NO, B_Address, Username, B_Password) VALUES (@First_Name, @Last_Name, @CNIC, @DOB, @Gender, @Phone_NO, @B_Address, @Username, @B_Password)");

        res.status(200).json(result.rowsAffected);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.post("/api/sellers", async (req, res) => {
    try {
        const { First_Name, Last_Name, CNIC, DOB, Gender, Phone_NO, S_Address, Username, S_Password } = req.body;

        if (!First_Name || !Last_Name || !Username || !S_Password) {
            return res.status(404).json({ success: false, message: "All fields are required." });
        }

        const pool = await poolAmazon;
        const result = await pool
            .request()
            .input("First_Name", sql.VarChar, First_Name)
            .input("Last_Name", sql.VarChar, Last_Name)
            .input("CNIC", sql.Char, CNIC)
            .input("DOB", sql.Date, DOB)
            .input("Gender", sql.Char, Gender)
            .input("Phone_NO", sql.VarChar, Phone_NO)
            .input("S_Address", sql.VarChar, S_Address)
            .input("Username", sql.VarChar, Username)
            .input("S_Password", sql.VarChar, hashPassword(S_Password))
            .query("INSERT INTO Seller (First_Name, Last_Name, CNIC, DOB, Gender, Phone_NO, S_Address, Username, S_Password) VALUES (@First_Name, @Last_Name, @CNIC, @DOB, @Gender, @Phone_NO, @S_Address, @Username, @S_Password)");

        res.status(200).json(result.rowsAffected);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const { Category_ID,  Seller_ID, Product_Name, Cost, Quantity, Size_ID, Color_ID, Material_ID, Brand_ID, Discount, P_Description, Best_Before_Or_Warranty, Genre, imageURL } = req.body;

        if (!Category_ID || !Product_Name || !Cost || Quantity === undefined || !imageURL) {
            return res.status(400).json({ success: false, message: "All required fields must be provided." });
        }

        const pool = await poolAmazon;
        const result = await pool
            .request()
            .input("Category_ID", sql.Int, Category_ID)
            .input("Seller_ID", sql.Int, Seller_ID) // Use session user ID
            .input("Product_Name", sql.VarChar, Product_Name)
            .input("Cost", sql.Decimal(10, 2), Cost)
            .input("Quantity", sql.Int, Quantity)
            .input("Size_ID", sql.Int, Size_ID)
            .input("Color_ID", sql.Int, Color_ID)
            .input("Material_ID", sql.Int, Material_ID)
            .input("Brand_ID", sql.Int, Brand_ID)
            .input("Discount", sql.Int, Discount)
            .input("P_Description", sql.VarChar, P_Description)
            .input("Best_Before_Or_Warranty", sql.Date, Best_Before_Or_Warranty)
            .input("Genre", sql.VarChar, Genre)
            .input("imageurl", sql.VarChar, imageURL)
            .query("INSERT INTO Products (Category_ID, Seller_ID, Product_Name, Cost, Quantity, Size_ID, Color_ID, Material_ID, Brand_ID, Discount, P_Description, Best_Before_Or_Warranty, Genre, imageurl) VALUES (@Category_ID, @Seller_ID, @Product_Name, @Cost, @Quantity, @Size_ID, @Color_ID, @Material_ID, @Brand_ID, @Discount, @P_Description, @Best_Before_Or_Warranty, @Genre, @imageurl)");

        res.status(201).json(result.rowsAffected);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/api/products", async(req,res) => {
    try{
        const pool = await poolAmazon;
        const result = await pool.query("SELECT * FROM Products");
        console.log(result);

        res.status(200).json({
            success:true,
            CatData:result.recordset
        })
    }
    catch(error){
        console.log('Error', error);
        res.status(500).json({
            success:false,
            message:"Server error, try again",
            error: error.message
        });
    }   
})
app.get("/api/products/:productId", async (req, res) => {
    const { productId } = req.params;
  
    try {
      const pool = await poolAmazon;
      const result = await pool
        .request()
        .input("productId", sql.Int, productId)
        .query(`
          SELECT *
          FROM Products p
          JOIN Categories cat ON p.Category_ID = cat.Category_ID
          LEFT JOIN Sizes s ON p.Size_ID = s.Size_ID
          LEFT JOIN Colors co ON p.Color_ID = co.Color_ID
          LEFT JOIN Materials m ON p.Material_ID = m.Material_ID
          LEFT JOIN Brands b ON p.Brand_ID = b.Brand_ID
          JOIN Seller sel ON p.Seller_ID = sel.Seller_ID
          WHERE p.Product_ID = @productId
        `);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      res.status(200).json({
        success: true,
        product: result.recordset[0],
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        success: false,
        message: "Server error, try again",
        error: error.message,
      });
    }
  });

app.post("/api/products/category", async (req, res) => {
    const { Category_Id } = req.body;
    if (!Category_Id) {
        return res.status(400).json({
          success: false,
          message: "Category_Id parameter is missing",
        });
      }
    
    console.log("Received Category_Id:", Category_Id);
    try {
      const pool = await poolAmazon;
      const result = await pool
        .request()
        .input("Category_ID", sql.Int, Category_Id)
        .query(`
          
select * from Products where Category_ID = @Category_ID
        `);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      res.status(200).json({
        success: true,
        product: result.recordset,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        success: false,
        message: "Server error, try again",
        error: error.message,
      });
    }
  });
  app.post("/api/transactions/pending", async (req, res) => {
    const { Seller_ID } = req.body;
  
    if (!Seller_ID) {
      return res.status(400).json({
        success: false,
        message: "Seller_ID parameter is missing",
      });
    }
  
    try {
      const pool = await poolAmazon;
      const result = await pool
        .request()
        .input("Seller_ID", sql.Int, Seller_ID)
        .query(`
          SELECT *
          FROM Transactions t
          JOIN Payments p ON t.Transaction_ID = p.Transaction_ID
          WHERE t.Seller_ID = @Seller_ID AND p.Payment_Status = 'Pending'
        `);
  
      if (result.recordset.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No pending transactions found for the given Seller_ID",
        });
      }
  
      res.status(200).json({
        success: true,
        transactions: result.recordset,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({
        success: false,
        message: "Server error, try again",
        error: error.message,
      });
    }
  });
  
  app.get("/api/reviews/:productId", async (req, res) => {
    const { productId } = req.params;
  
    try {
      const pool = await poolAmazon; // Assuming poolAmazon is your SQL Server connection pool
      const result = await pool
        .request()
        .input("productId", sql.Int, productId)
        .query(`
          SELECT 
            *
          FROM Reviews r
          JOIN Buyers b ON r.Buyer_ID = b.Buyer_ID
          WHERE r.Product_ID = @productId
        `);
  
      res.status(200).json({
        success: true,
        reviews: result.recordset,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({
        success: false,
        message: "Server error, try again",
        error: error.message,
      });
    }
  });
  
  app.post('/api/order', async (req, res) => {
    const {
      Product_ID,
      Category_ID,
      Seller_ID,
      Buyer_ID,
      Price_bought,
      Quantity,
      Payment_Status
    } = req.body;
  
    // Validate required fields
    if (!Product_ID || !Category_ID || !Seller_ID || !Buyer_ID || !Price_bought  || !Quantity || !Payment_Status) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
  
    try {
      const pool = await poolAmazon; // Replace with your actual connection string
  
      // Call the stored procedure
      const result = await pool.request()
        .input('Product_ID', sql.Int, Product_ID)
        .input('Category_ID', sql.Int, Category_ID)
        .input('Seller_ID', sql.Int, Seller_ID)
        .input('Buyer_ID', sql.Int, Buyer_ID)
        .input('Price_bought', sql.Decimal(10, 2), Price_bought)
        .input('Quantity', sql.Int, Quantity)
        .input('Payment_Status', sql.VarChar(20), Payment_Status)
        .execute('InsertTransactionAndPayment'); // Replace with your actual stored procedure name
  
      res.status(201).json({
        success: true,
        message: 'Transaction and payment recorded successfully',
        transactionId: result.recordset[0].Transaction_ID // Assuming your stored procedure returns the Transaction_ID
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({
        success: false,
        message: 'Database error',
        error: error.message
      });
    }
  });
  

app.post("/api/cart", async (req, res) => {
    try {
      const { Buyer_ID, Product_ID, Category_ID } = req.body;
  
      console.log("Incoming cart request:", req.body);
  
      if (!Buyer_ID || !Product_ID || !Category_ID) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
  
      const pool = await poolAmazon;
  
      const result = await pool
        .request()
        .input("Buyer_ID", sql.Int, Buyer_ID)
        .input("Product_ID", sql.Int, Product_ID)
        .input("Category_ID", sql.Int, Category_ID)
        .query("INSERT INTO Cart (Buyer_ID, Product_ID, Category_ID) VALUES (@Buyer_ID, @Product_ID, @Category_ID)");
  
      console.log("DB insert success:", result.rowsAffected);
  
      res.status(201).json({ success: true, result: result.rowsAffected });
  
    } catch (error) {
      console.error("ðŸš¨ Error inserting into Cart:", error); // Log exact error
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Change Buyer Password
app.put("/api/buyers/change-password", async (req, res) => {
    try {
        const { oldPassword, newPassword, username } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Both old and new passwords are required" });
        }

        const pool = await poolAmazon;

        // Fetch buyer's current password
        const result = await pool
            .request()
            .input("Username", sql.VarChar, username)
            .query("SELECT B_Password FROM Buyers WHERE Username = @Username");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Buyer not found" });
        }

        const storedHashedPassword = result.recordset[0].B_Password;

        // Verify old password
        if (!comparePassword(oldPassword, storedHashedPassword)) {
            return res.status(403).json({ success: false, message: "Incorrect old password" });
        }

        // Hash and update new password
        const newHashedPassword = hashPassword(newPassword);
        await pool
            .request()
            .input("Username", sql.VarChar, username)
            .input("Password", sql.VarChar, newHashedPassword)
            .query("UPDATE Buyers SET B_Password = @Password WHERE Username = @Username");

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



// Change Seller Password
app.put("/api/sellers/change-password", async (req, res) => {
    try {
        const { oldPassword, newPassword, username } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Both old and new passwords are required" });
        }

        const pool = await poolAmazon;

        // Fetch seller's current password
        const result = await pool
            .request()
            .input("Username", sql.VarChar, username)
            .query("SELECT S_Password FROM Seller WHERE Username = @Username");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        const storedHashedPassword = result.recordset[0].S_Password;

        // Verify old password
        if (!comparePassword(oldPassword, storedHashedPassword)) {
            return res.status(403).json({ success: false, message: "Incorrect old password" });
        }

        // Hash and update new password
        const newHashedPassword = hashPassword(newPassword);
        await pool
            .request()
            .input("Username", sql.VarChar, username)
            .input("S_Password", sql.VarChar, newHashedPassword)
            .query("UPDATE Seller SET S_Password = @S_Password WHERE Username = @Username");

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get buyer details by username
app.get("/api/buyers/username/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const pool = await poolAmazon;
        const result = await pool
            .request()
            .input("Username", sql.VarChar, username)
            .query("SELECT * FROM Buyers WHERE Username = @Username");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Buyer not found" });
        }

        res.status(200).json({ success: true, buyer: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Get seller details by username
app.get("/api/sellers/username/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const pool = await poolAmazon;
        const result = await pool
            .request()
            .input("Username", sql.VarChar, username)
            .query("SELECT * FROM Seller WHERE Username = @Username");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        res.status(200).json({ success: true, seller: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post("/api/reviews", async (req, res) => {
    try {
        const { Product_ID, Rating, Review_Text, Buyer_ID, Category_ID } = req.body;

        if (!Product_ID || !Rating) {
            return res.status(400).json({ success: false, message: "All required fields must be provided." });
        }

        const pool = await poolAmazon;
        const result = await pool
            .request()
            .input("Buyer_ID", sql.Int, Buyer_ID) // Get from session, not request body
            .input("Product_ID", sql.Int, Product_ID)
            .input("Rating", sql.Float, Rating)
            .input("Category_ID", sql.Int, Category_ID)
            .input("Review_Text", sql.VarChar, Review_Text)
            .query("INSERT INTO Reviews (Buyer_ID, Product_ID, Rating, Category_ID, Review) VALUES (@Buyer_ID, @Product_ID, @Rating, @Category_ID, @Review_Text)");

        res.status(201).json(result.rowsAffected);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/api/user/profile", authenticateSession, (req, res) => {
    res.json({ success: true, user: req.session.user });
});

app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Logout failed" });
        }
        res.status(200).json({ success: true, message: "Logged out successfully" });
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Get all categories