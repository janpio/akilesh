import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import slugify from 'slugify';

const notion = new Client({ auth: process.env.NOTION_KEY });

// get users
export const getUsers = async () => {
    const response = await notion.users.list({});
    return response.results;
};

export const getAllArticles = async (databaseId) => {
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            or: [
                {
                    property: 'Status',
                    select: {
                        equals: 'Publish'
                    }
                },
                {
                    property: 'Status',
                    select: {
                        equals: '✏️ Review'
                    }
                }
            ]
        },
        sorts: [
            {
                property: 'Date',
                direction: 'descending'
            }
        ]
    });

    return response.results;
};

export const convertToArticleList = (tableData: any) => {
    let tags: string[] = [];
    const articles = tableData.map((article: any) => {
        return {
            title: article.properties.Name.title[0].plain_text,
            tags: article.properties.tags.multi_select?.map((tag) => {
                if (!tags.includes(tag.name)) {
                    const newList = [...tags, tag.name];
                    tags = newList;
                }
                return { name: tag.name, id: tag.id };
            }),
            coverImage:
                article.cover.external.url ||
                article.properties?.coverImage?.files[0]?.file?.url ||
                article.properties.coverImage?.files[0]?.external?.url ||
                'https://via.placeholder.com/600x400.png',
            //publishedDate: article.properties.Published?.date?.start,
            summary:
                article.properties?.Summary.rich_text[0]?.plain_text ??
                'Placeholder summary',
            status: article.properties?.Status.select.name,
        };
    });

    return { articles, tags };
};

export const getPublishedArticles = async (databaseId) => {
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: 'Status',
            select: {
                equals: 'Publish'
            }
        },
        // sorts: [
        //     {
        //         property: 'Published',
        //         direction: 'descending'
        //     }
        // ]
    });

    return response.results;
};

export const getArticlePage = (data, slug) => {
    const response = data.find((result) => {
        if (result.object === 'page') {
            const resultSlug = slugify(
                result.properties.Name.title[0].plain_text
            ).toLowerCase();
            return resultSlug === slug;
        }
        return false;
    });

    return response;
};


export default notion;