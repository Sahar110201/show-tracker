'use client';

// The edit form for one comment, on its own page at /comments/<id>/edit.
// After saving it sends you back to the show page, where you see the new text.
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMessage } from '../../../components/MessageContext';
import { getFieldErrors } from '../../../components/formErrors';

export default function EditCommentPage() {
  // The folder name [id] puts the id in the address, so /comments/abc/edit gives id === 'abc'
  const routeParams = useParams();
  const id = routeParams.id;

  const router = useRouter();
  const { showMessage } = useMessage();

  // The comment we are editing. It stays null until it has loaded.
  const [comment, setComment] = useState(null);

  // What the user typed in the box
  const [text, setText] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // The messages that go next to a box, for example { text: 'Too short' }
  const [errors, setErrors] = useState({});

  // A message for when the comment cannot be loaded at all
  const [loadError, setLoadError] = useState('');

  // Load the one comment we are editing, so the box starts with its text in it.
  useEffect(() => {
    async function loadComment() {
      try {
        const res = await fetch('/api/comments/' + id);

        if (res.status === 404) {
          setLoadError('That comment was not found.');
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error('Could not load the comment');
        }

        const found = await res.json();
        setComment(found);
        setText(found.text);
      } catch {
        setLoadError('The comment could not be loaded. Is the API running?');
      }

      setLoading(false);
    }

    loadComment();
  }, [id]);

  // Runs when the user clicks Save changes.
  async function handleSave(event) {
    event.preventDefault();

    setSaving(true);
    setErrors({});

    try {
      const res = await fetch('/api/comments/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // A PUT replaces the whole comment, so the show id has to be sent again
        body: JSON.stringify({ tvmazeId: comment.tvmazeId, text: text }),
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

      // Put the message in the shared box, then go to the show page where it shows up
      showMessage('Comment updated');
      router.push('/shows/' + comment.tvmazeId);
    } catch {
      setErrors({ form: 'The comment could not be saved. Please try again.' });
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading comment...</p>;
  }

  // The comment is missing or the API is down, so there is no form to show
  if (loadError) {
    return (
      <>
        <p className="field-error">{loadError}</p>
        <p>
          <Link href="/comments" className="back">
            ← Back to all comments
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <p>
        <Link href={'/shows/' + comment.tvmazeId} className="back">
          ← Back to the show
        </Link>
      </p>

      <h1>Edit comment</h1>

      <form onSubmit={handleSave} className="comment-form">
        <label htmlFor="text">Comment</label>
        <textarea
          id="text"
          name="text"
          rows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        {/* The message for the text box, sent back by the API */}
        {errors.text && <p className="field-error">{errors.text}</p>}

        {/* A problem that is not about one box */}
        {errors.form && <p className="field-error">{errors.form}</p>}

        {/* The button turns off while the change is being sent */}
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </>
  );
}
