package utils

func RemoveDuplicates(input []string) []string {
	unique := make(map[string]struct{})
	for _, val := range input {
		unique[val] = struct{}{}
	}
	result := make([]string, 0, len(unique))
	for key := range unique {
		result = append(result, key)
	}
	return result
}
