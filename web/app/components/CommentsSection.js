'use client';

// The whole comments part of a show page: the list, the form that adds a comment
// and a delete button. The show page only has to write <CommentsSection tvmazeId={...} />.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMessage } from './MessageContext';
import { getFieldErrors } from './formErrors';

export default function CommentsSection({ tvmazeId }) {
  // The comments for this show
  const [comments, setComments] = useState([]);

  // True while the first load is still running
  const [loading, setLoading] = useState(true);

  // What the user typed in the box
  const [text, setText] = useState('');

  // True while we wait for the API, so we can turn the button off
  const [saving, setSaving] = useState(false);

  // The messages that go next to a box, for example { text: 'Too short' }
  const [errors, setErrors] = useState({});

  // A message for problems that are not about one box, like the API being down
  const [loadError, setLoadError] = useState('');

  const { showMessage } = useMessage();

  // Load the comments once, when the section first appears on screen.
  useEffect(() => {
    async function loadComments() {
      try {
        const res = await fetch('/api/comments');

        if (!res.ok) {
          throw new Error('Could not load the comments');
        }

        const all = await res.json();

        // Our API sends every comment, so keep only the ones for this show
        setComments(all.filter((comment) => comment.tvmazeId === tvmazeId));
      } catch {
        setLoadError('The comments could not be loaded. Is the API running?');
      }

      setLoading(false);
    }

    loadComments();
  }, [tvmazeId]);

  // Runs when the user clicks Post comment.
  async function handleCreate(event) {
    // Stops the browser from reloading the page
    event.preventDefault();

    setSaving(true);
    setErrors({});

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The API wants the show id as a number and the comment text
        body: JSON.stringify({ tvmazeId: tvmazeId, text: text }),
      });

      const body = await res.json();

      // 400 means the API did not like the data, so show the message next to the box
      if (res.status === 400) {
        setErrors(getFieldErrors(body));
        setSaving(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Could not save the comment');
      }

      // It worked: add the new comment to the list, empty the box and say so
      setComments([...comments, body]);
      setText('');
      showMessage('Comment added');
    } catch {
      setErrors({ form: 'The comment could not be saved. Please try again.' });
    }

    setSaving(false);
  }

  // Runs when the user clicks Delete on one comment.
  async function handleDelete(id) {
    try {
      const res = await fetch('/api/comments/' + id, { method: 'DELETE' });

      if (!res.ok) {
        throw new Error('Could not delete the comment');
      }

      // Take the deleted comment off the screen
      setComments(comments.filter((comment) => comment.id !== id));
      showMessage('Comment deleted');
    } catch {
      setErrors({ form: 'The comment could not be deleted. Please try again.' });
    }
  }

  // What to show above the form: a wait message, an error, nothing yet, or the list
  let list = null;
  if (loading) {
    list = <p>Loading comments...</p>;
  } else if (loadError) {
    list = <p className="field-error">{loadError}</p>;
  } else if (comments.length === 0) {
    list = <p>No comments yet. Be the first one!</p>;
  } else {
    list = (
      <ul className="comments">
        {comments.map((comment) => (
          // key tells React which comment is which when the list changes
          <li key={comment.id} className="comment">
            <p className="comment-text">{comment.text}</p>
            <p className="comment-actions">
              <Link href={'/comments/' + comment.id + '/edit'}>Edit</Link>
              <button type="button" onClick={() => handleDelete(comment.id)}>
                Delete
              </button>
            </p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section>
      {list}

      {/* The form that adds a new comment */}
      <form onSubmit={handleCreate} className="comment-form">
        <label htmlFor="text">Add a comment</label>
        <textarea
          id="text"
          name="text"
          rows={3}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What did you think of this show?"
        />

        {/* The message for the text box, sent back by the API */}
        {errors.text && <p className="field-error">{errors.text}</p>}

        {/* A problem that is not about one box */}
        {errors.form && <p className="field-error">{errors.form}</p>}

        {/* The button turns off while the comment is being sent */}
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Post comment'}
        </button>
      </form>
    </section>
  );
}
