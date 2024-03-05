package file

type File struct {
	FileId        int    `bun:"file_id,pk" json:"file_id"`
	FileName      string `bun:"file_name" json:"file_name"`
	FileUrl       string `bun:"file_url" json:"file_url"`
	UserId        int    `bun:"user_id" json:"user_id"`
	ApplicationId *int   `bun:"application_id,nullzero" json:"application_id"`
}
