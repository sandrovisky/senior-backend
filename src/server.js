const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
require("dotenv").config();
const apiURL = "https://jsonmock.hackerrank.com/api/movies/search";

const port = process.env.PORT || 3333;

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS")
  res.header("Access-Control-Allow-Credentials", "true")

  next()
});

app.use(express.json());

app.get("/api/movies/count", async (req, res) => {
  try {
    const { title } = req.query;
    let page = 1;
    let finalPage;
    let data = [];
    let total = 0;

    do {
      await axios.get(`${apiURL}/?Title=${title}&page=${page}`)
        .then((response) => {
          const resData = response.data;
          const movies = response.data.data;
          total = response.data.total;
          finalPage = resData.total_pages;
          page += 1;

          movies.forEach(movieData => {
            const index = data.findIndex(movie => movie.year === movieData.Year);

            if (index === -1) {
              data.push({
                year: movieData.Year,
                movies: 1
              });
            } else {
              data[index].movies += 1;
            }
          });
        })
    } while (page <= finalPage);

    return res.json({
      moviesByYear: data.sort((a, b) => {
        if (a.year > b.year) {
          return -1;
        }
        if (a.year < b.year) {
          return 1;
        }
        return 0;
      }),
      total
    })
  } catch {
    return res.json({message: "Erro na requisição!"})
  }
})

app.listen(port, () => console.log(`Server runing on port ${port}`));