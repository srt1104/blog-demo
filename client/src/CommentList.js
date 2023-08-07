import React from 'react';

const CommentList = ({ comments }) => {
    const renderedComments = comments.map(({ id, status, content }) => {
        switch (status) {
            case 'approved': break;
            case 'pending':
                content = 'This comment is awaiting moderation';
                break;
            case 'rejected':
                content = 'This comment has been rejected';
                break;
            default:
                content = '';
                break;
        }

        return <li key={id}>{content}</li>
    });

    return (
        <ul>
            {renderedComments}
        </ul>
    );
};

export default CommentList;
