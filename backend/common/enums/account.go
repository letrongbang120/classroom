package enums

type RoleIndex int

const (
	_ RoleIndex = iota
	User
	Admin
	SuperAdmin
)

func (r RoleIndex) String() string {
	return [...]string{"User", "Admin", "SuperAdmin"}[r-1]
}
