package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.New()

	server.Static("/assets", "./assets")
	server.LoadHTMLGlob("html/*.html")

	server.GET("/", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "index.html", nil)
	})

	server.NoRoute(func(ctx *gin.Context) {
		failRoute := ctx.Request.URL.Path
		ctx.HTML(http.StatusNotFound, "404.html", gin.H{
			"url": failRoute,
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	server.Run(":" + port)
}
