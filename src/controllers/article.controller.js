const articleModel = require("../models/articles.model");
const errorHandler = require("../helpers/errorHandler.helper");

exports.getArticle = async function (request, response) {
    try {
        const { rows: results, pageInfo } = await articleModel.findAllArticle(request.params);
        return response.json({
            success: true,
            message: "Get save post success",
            pageInfo,
            results,
        });
    } catch (error) {
        return errorHandler(response, error);
    }
};

