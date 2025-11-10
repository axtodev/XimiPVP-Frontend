<<<<<<< HEAD
=======
<<<<<<< HEAD
import React from "react"; 

function TagSelector({ tags = [], selectedTags, setSelectedTags }) {
  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  return (
    <div className="tag-selector">
      {tags.map(tag => (
        <label key={tag._id} className="tag-label">
          <input
            type="checkbox"
            checked={selectedTags.includes(tag._id)}
            onChange={() => toggleTag(tag._id)}
          />
          <span>{tag.name}</span>
        </label>
      ))}
    </div>
  );
}

=======
>>>>>>> 0c76dc1 (Initial commit)
import React from "react"; 

function TagSelector({ tags = [], selectedTags, setSelectedTags }) {
  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  return (
    <div className="tag-selector">
      {tags.map(tag => (
        <label key={tag._id} className="tag-label">
          <input
            type="checkbox"
            checked={selectedTags.includes(tag._id)}
            onChange={() => toggleTag(tag._id)}
          />
          <span>{tag.name}</span>
        </label>
      ))}
    </div>
  );
}

<<<<<<< HEAD
=======
>>>>>>> 6fb4cbabb18bdf363ddb9fdc66e5684e693227d1
>>>>>>> 0c76dc1 (Initial commit)
export default TagSelector;