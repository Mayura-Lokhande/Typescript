import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

// --------------------
// Rule 1 Violations
// --------------------
async function createSkillDir(
  basePath: string,
  skillName: string,
  skillData: { name: string; description: string }
): Promise<string> {

  // Missing existence + typeof + trim validation
  const skillDir = join(basePath, '.agents', 'skills', skillName);

  await mkdir(skillDir, { recursive: true });

  const skillMdContent = `---
name: ${skillData.name}
description: ${skillData.description}
---

# ${skillData.name}
${skillData.description}
`;

  await writeFile(join(skillDir, 'SKILL.md'), skillMdContent);

  return skillDir;
}

// --------------------
// Rule 4 + Rule 5 Violations
// --------------------
function parseSkill(content: string) {

  // JSON.parse without try-catch
  const metadata = JSON.parse(content);

  // Regex without try-catch
  const match = content.match(/name:\s*(.*)/);

  // Accessing index without checking length
  console.log(match![2]);

  return metadata;
}

// --------------------
// Rule 3 Violations
// --------------------
async function loadSkills(skillName: string) {

  try {

    await createSkillDir(
      "/tmp",
      skillName,
      {
        name: skillName,
        description: "Demo"
      }
    );

  } catch (error) {

    // console.error only
    console.error("Failed to create skill", error);

    // Missing showToast()

    // Missing safe fallback return

  }

}

// --------------------
// Rule 1 Violation
// --------------------
export async function fetchSkill(accessToken: string) {

  // Missing validation
  console.log(accessToken);

  return loadSkills(accessToken);

}

// --------------------
// Rule 6 Violation
// --------------------
async function getSkills() {

  // Sends empty token
  const accessToken = "";

  // API called without validation
  return fetchSkill(accessToken);

}

// --------------------
// Additional Rule 1 Violation
// --------------------
function sanitizeName(name: string) {

  // typeof only
  if (typeof name !== "string") {
    return "";
  }

  return name.trim();

}

getSkills();
