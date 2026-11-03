import Link from 'next/link';

export const metadata = {
  title: 'Comments',
};

// Asks our Express API for every comment. It runs on the server.
// cache: 'no-store' means we always get the newest list, not an old saved copy.
async function getComments() {
  const res = await fetch(process.env.API_URL + '/api/comments', { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Could not load the comments');
  }

  return res.json();
}

// The page that lists the comments from every show at /comments.
export default async function CommentsPage() {
  const comments = await getComments();

  // Empty state: a message when there are no comments at all
  if (comments.length === 0) {
    return (
      <>
        <h1>All comments</h1>
        <p className="subtitle">Comments you have left on your shows.</p>
        <p>There are no comments yet. Open a show and add the first one.</p>
      </>
    );
  }

  return (
    <>
      <h1>All comments</h1>
      <p className="subtitle">Comments you have left on your shows.</p>

      <ul className="comments">
        {comments.map((comment) => (
          // key tells React which comment is which when the list changes
          <li key={comment.id} className="comment">
            <p className="comment-text">{comment.text}</p>
            <p className="comment-actions">
              <Link href={'/shows/' + comment.tvmazeId}>View show</Link>
              <Link href={'/comments/' + comment.id + '/edit'}>Edit</Link>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
