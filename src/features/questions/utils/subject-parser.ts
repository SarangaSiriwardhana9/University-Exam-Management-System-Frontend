type SubjectData = {
  id: string
  code: string
  name: string
}

export const parseSubjectData = (subjectId: string): SubjectData => {
  try {
    if (typeof subjectId === 'string' && subjectId.includes('_id:')) {
      const idMatch = subjectId.match(/_id:\s*new ObjectId\('([^']+)'\)/)
      const codeMatch = subjectId.match(/subjectCode:\s*'([^']+)'/)
      const nameMatch = subjectId.match(/subjectName:\s*'([^']+)'/)
      
      if (idMatch && codeMatch && nameMatch) {
        return {
          id: idMatch[1],
          code: codeMatch[1],
          name: nameMatch[1]
        }
      }
    }
    
    if (typeof subjectId === 'string' && subjectId.startsWith('{')) {
      const cleaned = subjectId.replace(/\n/g, '').replace(/\s+/g, ' ')
      const parsed = JSON.parse(cleaned)
      return {
        id: parsed._id,
        code: parsed.subjectCode,
        name: parsed.subjectName
      }
    }
    
    return {
      id: subjectId,
      code: 'N/A',
      name: 'Subject not found'
    }
  } catch {
    return {
      id: subjectId,
      code: 'N/A',
      name: 'Subject not found'
    }
  }
}

export const extractSubjectId = (subjectId: string): string => {
  const parsed = parseSubjectData(subjectId)
  return parsed.id
}
