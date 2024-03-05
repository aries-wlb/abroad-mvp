package article

type Article struct {
	ArticleId  int    `bun:"article_id,pk" json:"article_id"`
	Title      string `bun:"title" json:"title"`
	ArticleUrl string `bun:"article_url" json:"article_url"`
	Content    string `bun:"content" json:"content"`
	Author     string `bun:"author" json:"author"`
}
