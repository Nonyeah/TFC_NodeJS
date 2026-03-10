import * as dotenv from "dotenv";
dotenv.config();
const express = require("express");
const mysql = require("mysql2/promise"); // Using mysql2/promise for async/await
const path = require("path");
import { NextFunction, Request, Response } from "express";
import { FieldPacket, RowDataPacket } from "mysql2";
import { SentMessageInfo } from "nodemailer";
import { DefaultSerializer } from "v8";
const fs = require("fs").promises;
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

// Initialize the Express application
const app = express();
const port = process.env.PORT || 3001;

//create transporter for sending system emails
const transporter = nodemailer.createTransport({
  host: "mail.thefashionconnector.com",
  port: 587, // or 587
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface MailOptions {
  from: string | undefined;
  subject: string;
  to: string;
  bcc: string;
  html: string | null;
}

const mailOptions: MailOptions = {
  from: process.env.EMAIL_USER,
  subject: "Thanks for subscribing",
  to: "",
  bcc: "",
  html: null,
};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // If true, the pool will queue connections if none are available
  connectionLimit: 10, // Maximum number of connections to create at once
  queueLimit: 0, // The maximum number of requests the pool will queue before returning an error
});

//console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD);

// Test database connection when the application starts
pool
  .getConnection()
  .then((connection: any) => {
    console.log("Successfully connected to MySQL database!");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err: Error | null) => {
    console.error("Failed to connect to MySQL database:", err);
    // Exit the process if database connection fails, as the app won't function
    process.exit(1);
  });

// Set EJS as the templating engine
app.set("view engine", "ejs");
// Specify the directory where your dynamic view templates are located
app.set("views", path.join(__dirname, "../views"));
//handle incoming json and parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, images, client-side JS) from the 'dist' directory
app.use(express.static(path.join(__dirname, "../client")));

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  let connection: any;
  try {
    connection = await pool.getConnection();
    const [leather]: [RowDataPacket[]] = await connection.execute(
      "SELECT * from luxecollection",
    );
    const [vegan]: [RowDataPacket[]] = await connection.execute(
      "SELECT * from vegancollection",
    );
    const allBags = [...leather, ...vegan];

    if (allBags.length === 0) {
      // If database does not return any bags
      const err = new Error(
        "We can't load the home page due to a server error",
      );
      throw err;
    }
    res.render("index", { homePageBags: allBags });
  } catch (err: any) {
    next(err);
  } finally {
    if (connection) connection.release();
  }
});

app.get("/bags", async (req: Request, res: Response, next: NextFunction) => {
  let connection: any;

  try {
    connection = await pool.getConnection();
    const [leatherHandbags]: [RowDataPacket[]] = await connection.execute(
      "SELECT * FROM luxecollection",
    );
    const [veganHandbags]: [RowDataPacket[]] = await connection.execute(
      "SELECT * FROM vegancollection",
    );

    const allbags = leatherHandbags.concat(veganHandbags);

    if (allbags.length === 0) {
      const err = new Error(
        "We can't show you any handbags due to a server error",
      );
      throw err;
    }

    allbags.sort((product1: RowDataPacket, product2: RowDataPacket) => {
      const str1 = product1.productName.toLowerCase();
      const str2 = product2.productName.toLowerCase();
      if (str1 > str2) return 1;
      if (str1 < str2) return -1;
      return 0;
    });

    res.render("bags", {
      product: allbags,
      productCategory: "all bags",
      label: "all bags",
    });
  } catch (err: any) {
    next(err);
  } finally {
    if (connection) connection.release();
  }
});

//code for rendering category pages
app.get(
  "/bags/:category",
  async (req: Request, res: Response, next: NextFunction) => {
    let connection: any;
    try {
      // Get the category type from the requested url
      let pageCategoryType: string | string[] = req.params.category;

      connection = await pool.getConnection();
      pageCategoryType = (pageCategoryType as string).toLowerCase();

      if (
        pageCategoryType === "tote" ||
        pageCategoryType === "hobo" ||
        pageCategoryType === "clutch" ||
        pageCategoryType === "briefcase" ||
        pageCategoryType === "crossbody" ||
        pageCategoryType === "shoulder" ||
        pageCategoryType === "briefcase" ||
        pageCategoryType === "backpack" ||
        pageCategoryType === "animal" ||
        pageCategoryType === "quilted"
      ) {
        const [leatherCategory]: RowDataPacket[] = await connection.execute(
          "SELECT * FROM luxecollection WHERE primaryCategory = ?",
          [pageCategoryType],
        );

        const [leatherCategory2]: RowDataPacket[] = await connection.execute(
          "SELECT * FROM luxecollection WHERE secondaryCategory = ?",
          [pageCategoryType],
        );

        const [veganCategory]: RowDataPacket[] = await connection.execute(
          "SELECT * FROM vegancollection WHERE primaryCategory = ?",
          [pageCategoryType],
        );

        const [veganCategory2]: RowDataPacket[] = await connection.execute(
          "SELECT * FROM vegancollection WHERE secondaryCategory = ?",
          [pageCategoryType],
        );

        const mergedResults = leatherCategory.concat(
          leatherCategory2,
          veganCategory,
          veganCategory2,
        );

        // Check if a product was found
        if (mergedResults.length === 0) {
          // If no product found, send a server error response
          const err = new Error(
            "The bag category type you've selected doesn't exist",
          );
          throw err;
        }

        //combine and sort the leather and vegan products in alphabetical order
        mergedResults.sort(
          (product1: RowDataPacket, product2: RowDataPacket) => {
            const str1 = product1.productName.toLowerCase();
            const str2 = product2.productName.toLowerCase();
            if (str1 > str2) return 1;
            if (str1 < str2) return -1;
            return 0;
          },
        );

        return res.render("bags", {
          product: mergedResults,
          productCategory: pageCategoryType,
          label: "category",
        });
      } else if (pageCategoryType === "leather") {
        const [allLeatherBags]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM luxecollection",
        );
        if (allLeatherBags.length === 0) {
          const err = new Error(
            "We can't display any leather bags at the moment",
          );
          throw err;
        }
        return res.render("bags", {
          product: allLeatherBags,
          productCategory: pageCategoryType,
        });
      } else if (pageCategoryType === "vegan") {
        const [veganBags]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM vegancollection",
        );
        if (veganBags.length) {
          return res.render("bags", {
            product: veganBags,
            productCategory: pageCategoryType,
          });
        }
      } else {
        const [colourLeather]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM luxecollection WHERE colour = ?",
          [pageCategoryType],
        );

        const [colourVegan]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM vegancollection WHERE colour = ?",
          [pageCategoryType],
        );

        const colour: RowDataPacket[] = [...colourLeather, ...colourVegan];

        if (colour.length === 0) {
          const err = new Error("We can't find that bag category type");
          throw err;
        }

        colour.sort((product1: RowDataPacket, product2: RowDataPacket) => {
          const str1 = product1.productName.toLowerCase();
          const str2 = product2.productName.toLowerCase();
          if (str1 > str2) return 1;
          if (str1 < str2) return -1;
          return 0;
        });

        return res.render("bags", {
          product: colour,
          productCategory: pageCategoryType,
          label: "colour",
        });
      }
    } catch (err) {
      next(err);
    } finally {
      if (connection) connection.release();
    }
  },
);

//code for rendering bag product pages
app.get(
  "/bags/products/:productUrl",
  async (req: Request, res: Response, next: NextFunction) => {
    let connection: any;
    try {
      let productUrl = req.params.productUrl;
      connection = await pool.getConnection();
      const [leatherResult]: RowDataPacket[] = await connection.execute(
        "SELECT * from luxecollection WHERE urlName = ?",
        [productUrl],
      );

      //logic for vegan bags
      if (!leatherResult.length) {
        const [veganResult] = await connection.execute(
          "SELECT * FROM vegancollection WHERE urlName = ?",
          [productUrl],
        );

        //display similar types of bags to main products in you may also like gallery
        const [similarItems] = await connection.execute(
          "SELECT * from vegancollection WHERE primaryCategory = ?",
          [veganResult[0].primaryCategory],
        );
        //render vegan bags
        if (similarItems.length && veganResult.length) {
          return res.render("bag-products", {
            product: veganResult,
            suggestions: similarItems,
            label: "",
          });
        } else {
          const err = new Error("We can't find any vegan bags at the moment");
          throw err;
        }
      }

      //logic for leather bags
      if (leatherResult) {
        const [similarItems] = await connection.execute(
          "SELECT * from luxecollection WHERE primaryCategory = ?",
          [leatherResult[0].primaryCategory],
        );
        //render leather bags
        if (leatherResult.length && similarItems.length) {
          return res.render("bag-products", {
            product: leatherResult,
            suggestions: similarItems,
            label: "",
          });
        } else {
          const err = new Error("We can't find any leather bags at the moment");
          throw err;
        }
      }
    } catch (err: any) {
      next(err);
    } finally {
      if (connection) connection.release();
    }
  },
);

app.get(
  "/jewellery{/:category}",
  async (req: Request, res: Response, next: NextFunction) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const pageCategoryType: string | string[] = req.params.category;
      if (!pageCategoryType) {
        const [monvatoo]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM monvatoo",
        );
        const [latelita]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM latelita",
        );
        const [marlin]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM marlin",
        );
        const [evb]: [RowDataPacket[]] =
          await connection.execute("SELECT * FROM evb");
        const allJewellery: RowDataPacket[] = [
          ...monvatoo,
          ...latelita,
          ...marlin,
          ...evb,
        ];

        allJewellery.sort(
          (product1: RowDataPacket, product2: RowDataPacket) => {
            const str1 = product1.productName.toLowerCase();
            const str2 = product2.productName.toLowerCase();
            if (str1 > str2) return 1;
            if (str1 < str2) return -1;
            return 0;
          },
        );

        return res.render("jewellery", {
          product: allJewellery,
          productCategory: "all jewellery",
        });
      } else if (
        pageCategoryType === "rings" ||
        pageCategoryType === "earrings" ||
        pageCategoryType === "bracelets" ||
        pageCategoryType === "necklaces" ||
        pageCategoryType === "cufflinks"
      ) {
        const [monvatoo]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM  monvatoo WHERE primaryCategory = ?",
          [pageCategoryType],
        );
        const [latelita]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM latelita WHERE primaryCategory = ?",
          [pageCategoryType],
        );
        const [marlin]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM marlin WHERE primaryCategory = ?",
          [pageCategoryType],
        );
        const [evb]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM evb WHERE primaryCategory = ?",
          [pageCategoryType],
        );

        const productAggregate: RowDataPacket[] = [
          ...monvatoo,
          ...latelita,
          ...marlin,
          ...evb,
        ];

        if (!productAggregate.length) {
          const err = new Error(
            "We can't find the jewellery category you are looking for",
          );
          throw err;
        }

        productAggregate.sort(
          (product1: RowDataPacket, product2: RowDataPacket) => {
            const str1 = product1.productName.toLowerCase();
            const str2 = product2.productName.toLowerCase();
            if (str1 > str2) return 1;
            if (str1 < str2) return -1;
            return 0;
          },
        );

        return res.render("jewellery", {
          product: productAggregate,
          productCategory: pageCategoryType,
        });
      } else if (
        pageCategoryType === "gemstone" ||
        pageCategoryType === "dragon" ||
        pageCategoryType === "animal"
      ) {
        const [monvatoo]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM monvatoo WHERE secondaryCategory = ?",
          [pageCategoryType],
        );
        const [latelita]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM latelita WHERE secondaryCategory = ?",
          [pageCategoryType],
        );
        const [marlin]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM marlin WHERE secondaryCategory = ?",
          [pageCategoryType],
        );
        const [evb]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM evb WHERE secondaryCategory = ?",
          [pageCategoryType],
        );
        const productAggregate: RowDataPacket[] = [
          ...monvatoo,
          ...latelita,
          ...marlin,
          ...evb,
        ];
        if (!productAggregate.length) {
          const err = new Error(
            "We can't find the jewellery category you're looking for",
          );
          throw err;
        }

        productAggregate.sort(
          (product1: RowDataPacket, product2: RowDataPacket) => {
            const str1 = product1.productName.toLowerCase();
            const str2 = product2.productName.toLowerCase();
            if (str1 > str2) return 1;
            if (str1 < str2) return -1;
            return 0;
          },
        );

        return res.render("jewellery", {
          product: productAggregate,
          productCategory: pageCategoryType,
        });
      } else if (
        pageCategoryType === "fashion" ||
        pageCategoryType === "realsilver" ||
        pageCategoryType === "vermeil" ||
        pageCategoryType === "realgold"
      ) {
        const [monvatoo]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM  monvatoo WHERE material = ?",
          [pageCategoryType],
        );
        const [latelita]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM latelita WHERE material = ?",
          [pageCategoryType],
        );
        const [marlin]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM marlin WHERE material = ?",
          [pageCategoryType],
        );
        const [evb]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM evb WHERE material = ?",
          [pageCategoryType],
        );

        const productAggregate: RowDataPacket[] = [
          ...monvatoo,
          ...latelita,
          ...marlin,
          ...evb,
        ];
        if (!productAggregate.length) {
          const err = new Error(
            "We can't find the jewellery product category you are looking for",
          );
          throw err;
        }

        productAggregate.sort(
          (product1: RowDataPacket, product2: RowDataPacket) => {
            const str1 = product1.productName.toLowerCase();
            const str2 = product2.productName.toLowerCase();
            if (str1 > str2) return 1;
            if (str1 < str2) return -1;
            return 0;
          },
        );

        return res.render("jewellery", {
          product: productAggregate,
          productCategory: pageCategoryType,
        });
      } else {
        const [monvatoo]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM  monvatoo WHERE colour = ?",
          [pageCategoryType],
        );
        const [latelita]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM latelita WHERE colour = ?",
          [pageCategoryType],
        );
        const [marlin]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM marlin WHERE colour = ?",
          [pageCategoryType],
        );
        const [evb]: [RowDataPacket[]] = await connection.execute(
          "SELECT * FROM evb WHERE colour = ?",
          [pageCategoryType],
        );

        const productAggregate = [...monvatoo, ...latelita, ...marlin, ...evb];

        if (!productAggregate.length) {
          const err = new Error(
            "We can't find the jewellery colour category you are looking for",
          );
          throw err;
        }

        productAggregate.sort(
          (product1: RowDataPacket, product2: RowDataPacket) => {
            const str1 = product1.productName.toLowerCase();
            const str2 = product2.productName.toLowerCase();
            if (str1 > str2) return 1;
            if (str1 < str2) return -1;
            return 0;
          },
        );

        return res.render("jewellery", {
          product: productAggregate,
          productCategory: pageCategoryType,
        });
      }
    } catch (err) {
      next(err);
    } finally {
      if (connection) connection.release();
    }
  },
);

//code for rendering jewellery product pages
app.get(
  "/jewellery/products/:productUrl",
  async (req: Request, res: Response, next: NextFunction) => {
    let connection;
    try {
      const url = req.params.productUrl;
      connection = await pool.getConnection();

      //query tables to find matching url row
      const [monvatooResult]: RowDataPacket[] = await connection.execute(
        "SELECT * FROM monvatoo WHERE urlName = ?",
        [url],
      );
      const [latelitaResult]: RowDataPacket[] = await connection.execute(
        "SELECT * FROM latelita WHERE urlName = ?",
        [url],
      );
      const [marlinResult]: RowDataPacket[] = await connection.execute(
        "SELECT * FROM marlin WHERE urlName = ?",
        [url],
      );
      const [evbResult]: RowDataPacket[] = await connection.execute(
        "SELECT * FROM evb WHERE urlName = ?",
        [url],
      );

      //merge query results into new array
      const productAggregate: RowDataPacket[] = [
        monvatooResult,
        latelitaResult,
        marlinResult,
        evbResult,
      ];

      let len: number = 0;
      productAggregate.forEach((value) => (len += value.length));
      //if url doesn't match anything in database
      if (!len) {
        const err = new Error(
          "We can't find the jewellery product you are looking for",
        );
        throw err;
      }

      //match url with designer brand
      for (let row of productAggregate) {
        if (row.length) {
          const [similarItems]: RowDataPacket[] = await connection.execute(
            `SELECT * FROM ${
              row[0].brand.toLowerCase().split(" ")[0]
            } WHERE primaryCategory = ?`,
            [`${row[0].primaryCategory}`],
          );

          if (similarItems.length) {
            return res.render("jewellery-products", {
              product: row,
              suggestions: similarItems,
              label: `${row[0].brand}`,
            });
          } else {
            const err = new Error(
              "We can't find the jewellery product you are looking for",
            );
            throw err;
          }
        }
      }
    } catch (err) {
      next(err);
    } finally {
      if (connection) connection.release();
    }
  },
);

//clothing endpoint includes category and product pages
app.get(
  "/clothing/{:productUrl}",
  async (req: Request, res: Response, next: NextFunction) => {
    let connection: any;
    try {
      connection = await pool.getConnection();
      let urlPath = req.params.productUrl;
      if (urlPath) {
        urlPath = (urlPath as string).toLowerCase();
        if (
          urlPath === "dresses" ||
          urlPath === "outwear" ||
          urlPath === "jumpsuits"
        ) {
          const [clothingType]: [RowDataPacket[]] = await connection.execute(
            "SELECT * FROM clothing where productCategory = ?",
            [urlPath],
          );

          if (!clothingType.length) {
            const err = new Error(`We can't find any ${urlPath}`);
            throw err;
          } else {
            return res.render("clothing", {
              products: clothingType,
              header: urlPath,
            });
          };
        } else if (urlPath === "allclothing") {
          const [allClothing]: [RowDataPacket[]] = await connection.execute(
            "SELECT * FROM clothing",
          );

          if (!allClothing.length) {
            const err = new Error(
              "We can't find any clothing at the moment due to a server error,"
            );
            throw err;
          }
          return res.render("clothing", {
            products: allClothing,
            header: "all clothing",
          });
        } else {
          //CFA for clothing product pages
          const [clothing]: [RowDataPacket[]] = await connection.execute(
            "SELECT * FROM clothing WHERE urlName = ?",
            [urlPath],
          );

          //if product exists query database for similar types of products
          if (clothing.length) {
            const similarItems: Promise<[RowDataPacket[], FieldPacket[]]> =
              await connection.execute(
                "SELECT * FROM clothing WHERE productCategory = ?",
                [clothing[0].productCategory],
              );

            const [sameTypes] = await similarItems;

            if (!sameTypes.length) {
              const err = new Error(
                "We can't find the clothing item you are looking for",
              );
              throw err;
            }
            if (sameTypes.length) {
              return res.render("clothing-products", {
                clothingItem: clothing,
                suggestions: sameTypes,
              });
            }
          } else {
            const err = new Error(
              "We can't find the clothing products you are looking for"
            );
            throw err;
          }
        }
      } else {
        const [allClothing] = await connection.execute(
          "SELECT * FROM clothing",
        );
        return res.render("clothing", {
          products: allClothing,
          header: "all clothing",
        });
      }
    } catch (err) {
      next(err);
    } finally {
      if (connection) connection.release();
    }
  },
);

app.get(
  "/brands/:designer",
  async (req: Request, res: Response, next: NextFunction) => {
    let connection;
    try {
      const designer = req.params.designer;
      connection = await pool.getConnection();
      const [brands] = await connection.execute(`SELECT * FROM ${designer}`);
      if (brands.length) {
        return res.render("jewellery", {
          product: brands,
          productCategory: designer,
        });
      }
    } catch (err) {
      next(err);
    } finally {
      if (connection) connection.release();
    }
  },
);

app.get(
  "/new-arrivals{/:productUrl}",
  async (req: Request, res: Response, next: NextFunction) => {
    let connection;
    try {
      connection = await pool.getConnection();
      const url: string | string[] = req.params.productUrl;
      if (!url) {
        //render new arrivals category pages
        const [newarrivals]: RowDataPacket[] = await connection.execute(
          "SELECT * FROM newarrivals",
        );
        if (newarrivals.length) {
          return res.render("new-arrivals", {
            product: newarrivals,
            productCategory: "new arrivals",
          });
        } else {
          const err = new Error("We can't find what you are looking for");
          throw err;
        }
      } else {
        //render product pages for new arrivals
        const url = req.params.productUrl;
        const [newProductArrivals]: RowDataPacket[] = await connection.execute(
          "SELECT * FROM newarrivals where urlName = ?",
          [url],
        );
        if (newProductArrivals.length) {
          //select similar items from database
          const [similarItems]: RowDataPacket[] = await connection.execute(
            "SELECT * from newarrivals WHERE primaryCategory = ?",
            [newProductArrivals[0].primaryCategory],
          );

          let productType: string = newProductArrivals[0].productType;
          productType = productType.toLowerCase();

          if (similarItems.length && productType === "bag") {
            return res.render("bag-products", {
              product: newProductArrivals,
              suggestions: similarItems,
              label: "new arrivals",
            });
          } else if (similarItems.length && productType === "jewellery") {
            return res.render("jewellery-products", {
              product: newProductArrivals,
              suggestions: similarItems,
              label: "new arrivals",
            });
          } else {
            const err = new Error(
              "We can't find the product you are looking for in new arrivals",
            );
            throw err;
          }
        }
      }
    } catch (err) {
      next(err);
    } finally {
      if (connection) connection.release();
    }
  },
);

app.get(
  "/customer-service/:csdetails",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = req.params.csdetails;
      switch (service) {
        case "contact":
          return res.render("about", { title: service });
          break;
        case "terms":
          return res.render("terms", { title: "terms and conditions" });
          break;
        case "faq":
          return res.render("faq", { title: "Frequently asked questions" });
          break;
        case "about":
          return res.render("about", { title: service });
          break;
        case "testimonials":
          return res.render("about", { title: service });
          break;
        case "cookies":
          return res.render("about", { title: service });
          break;
        case "advertising":
          return res.render("about", { title: service });
          break;
        default:
          return res.render("about", { title: service });
      }
    } catch (err: any) {
     err.message = "We can't find the page category you are looking for"
      next(err);
    }
  },
);

app.get(
  "/designer-showcase{/:designer}",
  async (req: Request, res: Response, next: NextFunction) => {
    let connection: any;
    try {
      connection = await pool.getConnection();
      const designerProfile = req.params.designer;
      if (designerProfile) {
        const [profile] = await connection.execute(
          "SELECT * FROM showcase WHERE designerName = ?",
          [designerProfile],
        );
        if (profile.length) {
          return res.render("designer-profile", { profile });
        } else {
          const err = new Error(
            "We can't find the designer you are looking for",
          );
          throw err;
        }
      } else {
        const [showcase] = await connection.execute("SELECT * FROM showcase");
        if (showcase.length) {
          return res.render("showcase", { showcaseData: showcase });
        } else {
          const err = new Error("We can't find the page you are looking for");
          throw err;
        }
      }
    } catch (err) {
      next(err);
    } finally {
      connection.release();
    }
  },
);

app.get(
  "/cancellation-form",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.sendFile(path.join(__dirname, "cancellation_form.pdf"));
    } catch (err: any) {
      err.message = "Cancellation form not found";
     next(err);
    }
  },
);

app.get("/search", async (req: Request, res: Response, next: NextFunction) => {
  const search: string = (req.query.search as string).toLowerCase().trim();
  const pattern = /[a-z\s0-9]+/;
  const match = pattern.test(search);
  if (!match || search.length > 60) {
    const err = new Error("We couldn't match your search query");
    throw err;
  }
  const parseQueryString = () => {
    const wildcard = "%";
    let i = 0;
    let queryString: string | undefined;
    queryString = `${wildcard}`;
    while (i < search.length) {
      if (search[i] === " ") {
        queryString += "% ";
        i++;
        queryString += wildcard;
      } else {
        queryString += search[i++];
      }
    }
    queryString += wildcard;
    return queryString;
  };

  const SQLCommand = () => {
    //obtain query string array
    const parsedQueryStringArray = parseQueryString().split(" ");

    let i = 0;
    const ANDIterations: number = parsedQueryStringArray.length - 1;
    let SQLQueryString: string | undefined;

    // build sql commands from while loop
    SQLQueryString = `WHERE keywords LIKE '${parsedQueryStringArray[i++]}' `;
    while (i <= ANDIterations) {
      SQLQueryString += `AND keywords LIKE '${parsedQueryStringArray[i++]}' `;
    }

    return SQLQueryString;
  };

  const connection: any = await pool.getConnection();
  try {
    const [qM]: [RowDataPacket[]] = await connection.execute(
      `SELECT * FROM luxecollection ${SQLCommand()}`,
    );
    const [qM2]: [RowDataPacket[]] = await connection.execute(
      `SELECT * FROM vegancollection ${SQLCommand()}`,
    );
    const [qM3]: [RowDataPacket[]] = await connection.execute(
      `SELECT * FROM monvatoo ${SQLCommand()}`,
    );
    const [qM4]: [RowDataPacket[]] = await connection.execute(
      `SELECT * FROM latelita ${SQLCommand()}`,
    );
    const [qM5]: [RowDataPacket[]] = await connection.execute(
      `SELECT * FROM marlin ${SQLCommand()}`,
    );
    const [qM6]: [RowDataPacket[]] = await connection.execute(
      `SELECT * FROM evb ${SQLCommand()}`,
    );
    const [qM7]: [RowDataPacket[]] = await connection.execute(
      `SELECT * FROM clothing ${SQLCommand()}`,
    );

    const qMTotal = [...qM, ...qM2, ...qM3, ...qM4, ...qM5, ...qM6, ...qM7];
    if (qMTotal.length) {
      return res.render("search-results", {
        product: qMTotal,
        title: `search results for ${search}`,
      });
    } else {
      const err = new Error("Your search query returned no matches");
      throw err;
    }
  } catch (err) {
    next(err);
  } finally {
    if (connection) connection.release();
  }
});

app.get("/wishlist-empty", async (req: Request, res: Response) => {
  res.render("wishlist-empty");
});

app.get("/wishlist", async (req: Request, res: Response) => {
  return res.render("wishlist-get");
});

app.post(
  "/wishlist",
  async (req: Request, res: Response, next: NextFunction) => {
    let connection: any;
    let placeholders: string;
    const wishlistItems: string[] | string | undefined = req.body.mywish;
    if (!wishlistItems) return res.render("wishlist-empty");
    if (Array.isArray(wishlistItems)) {
      placeholders = wishlistItems.map(() => "?").join(", ");
    } else {
      placeholders = "?";
    }

    try {
      connection = await pool.getConnection();
      if (Array.isArray(wishlistItems)) {
        const [myWishlistLeather]: [RowDataPacket[]] = await connection.execute(
          `SELECT * FROM luxecollection WHERE ROCformName IN (${placeholders})`,
          wishlistItems,
        );

        const [myWishlistVegan]: [RowDataPacket[]] = await connection.execute(
          `SELECT * FROM vegancollection WHERE ROCformName IN (${placeholders})`,
          wishlistItems,
        );

        const [myWishlistClothing]: [RowDataPacket[]] =
          await connection.execute(
            `SELECT * FROM clothing WHERE ROCformName IN (${placeholders})`,
            wishlistItems,
          );

        const [myWishlistMonvatoo]: [RowDataPacket[]] =
          await connection.execute(
            `SELECT * FROM monvatoo WHERE ROCformName IN (${placeholders})`,
            wishlistItems,
          );

        const [myWishlistlatelita]: [RowDataPacket[]] =
          await connection.execute(
            `SELECT * FROM latelita WHERE ROCformName IN (${placeholders})`,
            wishlistItems,
          );

        const [myWishlistevb]: [RowDataPacket[]] = await connection.execute(
          `SELECT * FROM evb WHERE ROCformName IN (${placeholders})`,
          wishlistItems,
        );

        const [myWishlistmarlin]: [RowDataPacket[]] = await connection.execute(
          `SELECT * FROM marlin WHERE ROCformName IN (${placeholders})`,
          wishlistItems,
        );

        const mergedResults: RowDataPacket[] = [
          ...myWishlistLeather,
          ...myWishlistVegan,
          ...myWishlistClothing,
          ...myWishlistlatelita,
          ...myWishlistMonvatoo,
          ...myWishlistevb,
          ...myWishlistmarlin,
        ];

        if (!mergedResults.length) {
          return res.render("wishlist-empty");
        }
        return res.render("wishlist", { wishItems: mergedResults });
      } else {
        const [myWishlistLeather]: [RowDataPacket[]] = await connection.execute(
          `SELECT * FROM luxecollection WHERE ROCformName IN (${placeholders})`,
          [wishlistItems],
        );

        const [myWishlistVegan]: [RowDataPacket[]] = await connection.execute(
          `SELECT * FROM vegancollection WHERE ROCformName IN (${placeholders})`,
          [wishlistItems],
        );

        const [myWishlistClothing]: [RowDataPacket[]] =
          await connection.execute(
            `SELECT * FROM clothing WHERE ROCformName IN (${placeholders})`,
            [wishlistItems],
          );

        const [myWishlistNewArrivals]: [RowDataPacket[]] =
          await connection.execute(
            `SELECT * FROM newarrivals WHERE ROCformName IN (${placeholders})`,
            [wishlistItems],
          );

        const [myWishlistMonvatoo]: [RowDataPacket[]] =
          await connection.execute(
            `SELECT * FROM monvatoo WHERE ROCformName IN (${placeholders})`,
            [wishlistItems],
          );

        const [myWishlistlatelita]: [RowDataPacket[]] =
          await connection.execute(
            `SELECT * FROM latelita WHERE ROCformName IN (${placeholders})`,
            [wishlistItems],
          );

        const [myWishlistevb]: [RowDataPacket[]] = await connection.execute(
          `SELECT * FROM evb WHERE ROCformName IN (${placeholders})`,
          [wishlistItems],
        );

        const [myWishlistmarlin]: [RowDataPacket[]] = await connection.execute(
          `SELECT * FROM marlin WHERE ROCformName IN (${placeholders})`,
          [wishlistItems],
        );

        const mergedResults: RowDataPacket[] = [
          ...myWishlistLeather,
          ...myWishlistVegan,
          ...myWishlistClothing,
          ...myWishlistNewArrivals,
          ...myWishlistMonvatoo,
          ...myWishlistevb,
          ...myWishlistlatelita,
          ...myWishlistmarlin,
        ];

        if (!mergedResults.length) {
          return res.render("wishlist-empty");
        }
        return res.render("wishlist", { wishItems: mergedResults });
      }
    } catch (err) {
      next(err);
    } finally {
      if (connection) connection.release();
    }
  },
);

app.post(
  "/subscribe",
  async (req: Request, res: Response, next: NextFunction) => {
    let subscribeArray: string[] = [];
    try {
      //save user email in email variable
      let { email } = req.body;

      //return if user does not provide email
      if (!email) return;

      email = email.toLowerCase().trim();

      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const match = regex.test(email);
      if (!match) {
        return res.send(
          "please enter a vaild email address using correct characters",
        );
      }
      //parse current subscriber list and copy current subscribers into subscriber array
      if (email) {
        let fileContents: string = await fs.readFile(
          path.join(__dirname, "subscriber-list.txt"),
          "utf8",
        );

        if (fileContents) {
          subscribeArray = subscribeArray.concat(JSON.parse(fileContents));
          if (subscribeArray.length > 10) {
            return res.send("subscriber list is full, please try again later");
          }
          //check for duplicate email addresses and replace if a match is found
          let emailMatch: string | undefined = subscribeArray.find(
            (currentSubscriber) => currentSubscriber === email,
          );
          if (emailMatch) {
            subscribeArray.splice(subscribeArray.indexOf(emailMatch), 1, email);
          } else {
            //add new subscriber to subscriber array
            subscribeArray.push(email);
          }
        } else {
          //if subscriber list is empty
          subscribeArray.push(email);
        }
      }

      const newsletter = await fs.readFile(
        path.join(__dirname, "confirm-subscribe.html"),
        "utf8",
      );
      //add subscriber email to options configuration
      mailOptions.to = email;
      mailOptions.bcc = `hello@thefashionconnector.com`;
      mailOptions.html = newsletter;

      //save updated subscriber list
      await fs.writeFile(
        path.join(__dirname, "subscriber-list.txt"),
        JSON.stringify(subscribeArray, null, 2),
        "utf8",
      );

      transporter.sendMail(
        mailOptions,
        (err: Error | null, info: SentMessageInfo) => {
          if (err) {
            return res.send(
              "Could not add you to the subscriber list at the moment. Please try again later",
            );
          } else {
            return res.send(
              "You've been added to our subscriber list! Check your email for confirmation",
            );
          }
        },
      );
    } catch (err: any) {
      return res.send(
        "Could not add you to the subscriber list at the moment. Please try again later",
      );
    }
  },
);

app.use((req: Request, res: Response) => {
  return res.status(404).render("error", {
    type: "404 Blooper",
    message: "Oh fiddlesticks! We can't find the page you're looking for",
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  return res.status(status).render("error", {
    type: "Server",
    message: "Well that's embarrassing",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
