import antfu from "@antfu/eslint-config";
import zin from "@zinkawaii/eslint-config";

export default antfu({
    jsonc: {
        overrides: {
            "jsonc/indent": ["warn", 2]
        }
    },
    markdown: false,
    rules: {
        ...zin.standard,
        ...zin.recommended,
        ...zin.stylistic,
        ...zin.patch
    }
});