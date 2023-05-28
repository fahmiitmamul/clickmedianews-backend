const savePosteModel = require("../models/savedPost.model");
const articleModel = require("../models/articles.model");
// const profileModel = require("../models/profile.model");
const errorHandler = require("../helpers/errorHandler.helper");

exports.getSavePost = async function (request, response) {
    try {
        const { id } = request.user;
        const { rows: results, pageInfo } = await savePosteModel.findAll(
            request.params,
            id
        );
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

exports.getALLSavePost = async function (request, response) {
    try {
        const {id} = request.user;
        const savePost = await savePosteModel.findAllSavedArticle(id);
        console.log(savePost)
        const findArticle = await articleModel.findAllSavedArticle(id, savePost.articleId);
        return response.json({
            success: true,
            message: "savePost",
            results: findArticle
        });
    }catch(err) {
        return errorHandler(response, err);
    }
};

exports.getSavePosts = async (request, response) => {
    try {
        const {id} = request.user;
        const {articleId} = request.body;
        const savePost = await savePosteModel.findOne(articleId, id);
        if(savePost) {
            return response.json({
                success: true,
                message: "save article",
                results: savePost
            });
        }
    }catch(err) {
        return errorHandler(response, err);
    }
};

// exports.deleteSavePost = async function (request, response) {
//     try {
//         const data = await savePosteModel.findOne(
//             request.body.id,
//             request.user
//         );
//         if (!data) {
//             throw Error("article not found");
//         }
//         const dltArticle = await savePosteModel.destroy(
//             request.body.id,
//             request.user
//         );
//         if (dltArticle) {
//             return response.json({
//                 success: true,
//                 message: "Article unsave success",
//                 results: dltArticle,
//             });
//         }
//     } catch (error) {
//         return errorHandler(response, error);
//     }
// };

exports.deleteSavePost = async (request, response) => {
    try {
        const {id} = request.user;
        const articleId = request.params.id;
        const savePost = await savePosteModel.findOne(articleId, id);
        console.log(savePost);
        if (!savePost) {
            return response.status(404).json({
                success: false,
                message: "Error: save post not found or unauthorized",
            });
        }
        const deletedSavePost = await savePosteModel.destroy(articleId, id);
        return response.json({
            success: true,
            message: "Delete save post successfully",
            result: deletedSavePost,
        });
    } catch (err) {
        errorHandler(response, err);
    }
};


exports.createSavePost = async (request, response) => {
    try {
        const {id} = request.user;
        let {articleId} = request.body;
        const findArticle = await articleModel.findOne(articleId);
        if(!findArticle) {
            throw Error("article_not_found");
        }
        const createSavePost = await savePosteModel.insert({articleId, userId: id});
        const findSavePostUser = await articleModel.findOneSavedArticle(articleId, id);

        createSavePost;
        return response.json({
            success: true,
            message: "Create save post successfully",
            result: findSavePostUser
        });
    }catch(err) {
        errorHandler(response, err);
    }
};
