const db = require("../helpers/db.helper");

exports.findAllArticle = async function (params) {
    params.page = parseInt(params.page) || 1;
    params.limit = parseInt(params.limit) || 5;
    params.search = params.search || "";
    params.sort = params.sort || "id";
    params.sortBy = params.sortBy || "ASC";

    const offset = (params.page - 1) * params.limit;

    const query = `
    SELECT
        "id",
        "picture",
        "title",
        "descriptions",
        "likes",
        "categoryId",
        "e"."createdAt",
        "e"."updatedAt"
    FROM "articles"
    WHERE "id" LIKE $3
    ORDER BY ${params.sort} ${params.sortBy}
    LIMIT $1 OFFSET $2
    `;
    const values = [params.limit, offset, `%${params.search}%`];
    const { rows } = await db.query(query, values);
    return rows;
};
