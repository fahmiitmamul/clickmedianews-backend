const db = require("../helpers/db.helper");

const table = "articleComments";

exports.findAll = async (qs) => {
    qs.page = parseInt(qs.page) || 1;
    qs.limit = parseInt(qs.limit) || 5;
    qs.search = qs.search || "";
    qs.sort = qs.sort || "id";
    qs.sortBy = qs.sortBy || "ASC";

    const offset = (qs.page - 1) * qs.limit;
    const query = `
    SELECT * FROM "${table}"
    WHERE "id"::TEXT LIKE $3
    ORDER BY ${qs.sort} ${qs.sortBy}
    LIMIT $1 OFFSET $2
    `;
    const values = [qs.limit, offset, `%${qs.search}%`];
    const { rows } = await db.query(query, values);
    return rows;
};

exports.findOne = async (id) => {
    const query = `
    SELECT * FROM "${table}" WHERE id=$1
    `;
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0];
};

exports.findOneByUserIdAndArticleId = async function (userId, articleId) {
    const query = `
    SELECT "textComment" FROM "${table}" WHERE userId=$1 AND articleId=$2
    `;
    const values = [userId, articleId];
    const { rows } = await db.query(query, values);
    return rows[0];
};

exports.insert = async function (data) {
    const query = `
    INSERT INTO "${table}" ("articleId", "userId", "commentText")
    VALUES ($1, $2, $3) RETURNING *
    `;
    const values = [data.articleId, data.userId, data.commentText];
    const { rows } = await db.query(query, values);
    return rows[0];
};

exports.update = async (id, data) => {
    const query = `
    UPDATE "${table}" 
    SET 
    "articleId"=COALESCE(NULLIF($2::INTEGER, NULL), "articleId"),
    "userId"=COALESCE(NULLIF($3::INTEGER, NULL), "userId"),
    "commentText"=COALESCE(NULLIF($4, ''), "commentText")
    WHERE "id"=$1
    RETURNING *;
    `;
    const values = [id, data.articleId, data.userId, data.commentText];
    const { rows } = await db.query(query, values);
    return rows[0];
};

exports.destroy = async (id) => {
    const query = `
    DELETE FROM "${table}" WHERE "id"=$1
    RETURNING *;
    `;
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0];
};
