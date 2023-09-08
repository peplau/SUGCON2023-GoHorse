using Sitecore.Diagnostics;
using Sitecore.Rules;
using Sitecore.Rules.Conditions;

namespace XmCloudSXAStarter.Rules
{
    public class PersonalizeConnectCondition<T> : StringOperatorCondition<T> where T : RuleContext
    {
        public string experienceId { get; set; }
        public string experienceValue { get; set; }

        protected override bool Execute(T ruleContext)
        {
            Assert.ArgumentNotNull(ruleContext, "ruleContext");
            string currentExperienceId = ruleContext.Parameters["experienceId"]?.ToString();
            string currentExperienceValue = ruleContext.Parameters["experienceValue"]?.ToString();

            // Normally it will always return false, so the default variation is displayed
            if (string.IsNullOrEmpty(currentExperienceId))
                return false;

            // If ruleContext has parameters set we can use the logic
            return currentExperienceId == experienceId
                && currentExperienceValue == experienceValue;
        }
    }
}