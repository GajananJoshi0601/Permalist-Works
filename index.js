import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "permalist",
    password: "gj",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
    { id: 1, title: "Buy milk" },
    { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {

    try {
        const result = await db.query("SELECT * FROM items ORDER BY id ASC");
        items = result.rows;

        res.render("index.ejs", {
            listTitle: "Today",
            listItems: items,
        });
    } catch (err) {
        console.log(err);
    }

});

app.post("/add", (req, res) => {
    const item = req.body.newItem;
    // items.push({ title: item });
    try {
        const result = db.query("insert into items (title) values ($1)", [item]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

app.post("/edit", (req, res) => {
    const title = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;
    try {
        const result = db.query("Update items set title = ($1) where id = $2", [title], [id]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

app.post("/delete", (req, res) => {
    const id = req.body.deleteItemId;
    try {
        const result = db.query("Delete from items where id = $1", [id]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});